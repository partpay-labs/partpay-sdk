import { Injectable } from '@nestjs/common';
import { ComputeBudgetProgram, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';
import { ActionMetadata, FinancingOption } from '../type/actionMetadata';
import { ConfigService } from '@nestjs/config';
import { publicKey } from '@metaplex-foundation/umi';
import { EquipmentMetadata, PartPayClient } from '@partpay-libs/sdk';

@Injectable()
export class PayService {
    constructor(
        private readonly partPayClient: PartPayClient,
    ) {}

    async getPaymentAction(pubkey: string): Promise<ActionGetResponse> {
        const equipment = await this.partPayClient.getEquipment(publicKey(pubkey));
        const actionData: ActionMetadata = this.createActionMetadata(equipment);

        return {
            icon: actionData.icon,
            title: actionData.title,
            description: actionData.description,
            label: actionData.label,
            links: {
                actions: [
                    {
                        label: "Full payment",
                        href: `/pay/action/${pubkey}/full`,
                    },
                    {
                        label: "Installment",
                        href: `/pay/action/${pubkey}/installments`,
                        parameters: [
                            {
                                name: "installmentPlan",
                                label: "Choose Installment Plan",
                                type: "select",
                                options: actionData.financingOptions.map((option, index) => ({
                                    label: this.formatFinancingOptionLabel(option),
                                    value: index.toString(),
                                })),
                            },
                        ],
                    },
                ],
            },
        };
    }

    async createFullPaymentTransaction(
        body: ActionPostRequest,
        equipmentPubkey: string
    ): Promise<ActionPostResponse> {
        const equipment = await this.partPayClient.getEquipment(publicKey(equipmentPubkey));

        const transaction = new Transaction();

        transaction.add(
            ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: 1000,
            })
        );

        transaction.add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey(body.account),
                toPubkey: new PublicKey(equipment.owner),
                lamports: equipment.price * LAMPORTS_PER_SOL,
            })
        );

        transaction.feePayer = new PublicKey(body.account);
        const { blockhash } = await this.partPayClient.getAccountInfo(new PublicKey(body.account));
        transaction.recentBlockhash = blockhash;

        return await createPostResponse({
            fields: {
                transaction,
            },
        });
    }

    async createInstallmentPlanTransaction(
        equipmentPubkey: string,
        body: ActionPostRequest,
        installmentPlanIndex: number
    ): Promise<ActionPostResponse> {
        const equipment = await this.partPayClient.getEquipment(publicKey(equipmentPubkey));
        const selectedPlan = equipment.financingOptions[installmentPlanIndex];
    
        if (!selectedPlan) {
            throw new Error('Invalid installment plan selected');
        }
    
        // Check for existing installment plan
        const hasExistingPlan = await this.partPayClient.checkExistingInstallmentPlan(
            new PublicKey(equipmentPubkey),
            new PublicKey(body.account)
        );
    
        if (hasExistingPlan) {
            throw new Error('An installment plan already exists for this equipment and borrower');
        }
    
        const transaction = new Transaction();
    
        // Add compute budget instruction (optional, adjust as needed)
        transaction.add(
            ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: 1000,
            })
        );
    
        // Add the down payment or first installment transfer
        const paymentAmount = BigInt(selectedPlan.minimumDownPayment);
        if (paymentAmount > 0) {
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(body.account),
                    toPubkey: new PublicKey(equipment.owner),
                    lamports: Number(paymentAmount),
                })
            );
        }
    
        // Get the installment plan creation instructions
        const installmentPlanInstructions = await this.partPayClient.createInstallmentPlanTransaction(
            publicKey(equipmentPubkey),
            publicKey(body.account),
            selectedPlan
        );
    
        // Add the installment plan creation instructions to the transaction
        transaction.add(Transaction.from(Buffer.from(installmentPlanInstructions)));
    
        // Set fee payer and recent blockhash
        transaction.feePayer = new PublicKey(body.account);
        const { blockhash } = await this.partPayClient.getAccountInfo(new PublicKey(body.account));
        transaction.recentBlockhash = blockhash;
    
        return await createPostResponse({
            fields: {
                transaction,
                message: `Please sign the transaction to set up your installment plan and make the initial payment of ${selectedPlan.minimumDownPayment} lamports for ${this.formatFinancingOptionLabel(selectedPlan)}.`,
            },
        });
    }

    private createActionMetadata(equipment: EquipmentMetadata): ActionMetadata {
        return {
            icon: equipment.image,
            title: `Pay for ${equipment.name}`,
            description: `Complete your payment for ${equipment.name}`,
            label: "Pay Now",
            pubkey: equipment.walletAddress.toString(),
            financingOptions: equipment.financingOptions,
        };
    }

    private formatFinancingOptionLabel(option: FinancingOption): string {
        const termText = `${option.term} ${option.termUnit}`;
        return `${termText} at ${option.interestRate}% APR (Min down payment: ${option.minimumDownPayment.toString()})`;
    }
}