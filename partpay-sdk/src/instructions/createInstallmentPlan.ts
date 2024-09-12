import { TransactionBuilder, PublicKey, Umi, generateSigner } from '@metaplex-foundation/umi';
import { PARTPAY_PROGRAM_ID } from '../constants';
import { struct, u64, u8, u16, i64 } from '@metaplex-foundation/umi/serializers';

/**
 * Creates an installment plan for a piece of equipment.
 * This function sets up a plan with specific parameters including total amount, 
 * number of installments, interest rate, and the first payment date.
 *
 * @param umi - The Umi object to interact with the blockchain.
 * @param params - The parameters required to create the installment plan.
 * @param params.equipment - The PublicKey of the equipment for which the installment plan is being created.
 * @param params.borrower - The PublicKey of the borrower who will follow the installment plan.
 * @param params.totalAmount - The total amount to be paid in installments.
 * @param params.installmentCount - The number of installments in the plan.
 * @param params.interestRate - The interest rate applied to the installment plan.
 * @param params.firstPaymentDate - The date of the first payment in the installment plan.
 * @returns A TransactionBuilder that handles the creation of the installment plan on-chain.
 */
export const createInstallmentPlan = (
  umi: Umi,
  params: {
    equipment: PublicKey;
    borrower: PublicKey;
    totalAmount: number;
    installmentCount: number;
    interestRate: number;
    firstPaymentDate: Date;
  }
): TransactionBuilder => {
  const installmentPlan = generateSigner(umi); // Generates a signer for the new installment plan.

  return (new TransactionBuilder()).add({
    instruction: {
      programId: PARTPAY_PROGRAM_ID, // Program ID where the instruction will be executed.
      keys: [
        { pubkey: params.equipment, isSigner: false, isWritable: true }, // Equipment involved in the installment.
        { pubkey: params.borrower, isSigner: true, isWritable: true }, // The borrower making the installment payments.
        { pubkey: installmentPlan.publicKey, isSigner: true, isWritable: true }, // The newly created installment plan.
        { pubkey: umi.payer.publicKey, isSigner: true, isWritable: true }, // The payer who signs the transaction.
      ],
      data: struct([
        ['totalAmount', u64()], // Total amount in the installment plan serialized as an unsigned 64-bit integer.
        ['installmentCount', u8()], // Number of installments serialized as an unsigned 8-bit integer.
        ['interestRate', u16()], // Interest rate serialized as an unsigned 16-bit integer.
        ['firstPaymentDate', i64()], // First payment date serialized as a 64-bit integer (timestamp).
      ]).serialize({
        totalAmount: BigInt(params.totalAmount), // Converts the total amount to BigInt for serialization.
        installmentCount: params.installmentCount, // Number of installments.
        interestRate: params.interestRate, // Interest rate of the installment plan.
        firstPaymentDate: BigInt(params.firstPaymentDate.getTime() / 1000), // Converts the date to seconds since the epoch.
      }),
    },
    signers: [installmentPlan], // Adds the installment plan signer to the transaction.
    bytesCreatedOnChain: 200, // Estimated bytes that will be created on-chain.
  });
};