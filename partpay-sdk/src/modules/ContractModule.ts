import {
  publicKey,
  PublicKey,
  transactionBuilder,
  WrappedInstruction
} from "@metaplex-foundation/umi";
import {
  Serializer,
  struct,
  u64,
  i64,
  option,
  bytes,
} from "@metaplex-foundation/umi-serializers";
import { PartPayClient } from "../hooked";
import { PARTPAY_PROGRAM_ID } from "../constants";
import { PublicKey as Pubkey } from "@solana/web3.js";
import { ContractData } from "../types";

export class ContractModule {
  constructor(private client: PartPayClient) { }

  async createContract(
    buyer: PublicKey,
    seller: PublicKey,
    totalAmount: bigint,
    durationSeconds: number,
    installmentFrequency: bigint,
    insurancePremium?: bigint
  ): Promise<PublicKey> {
    const umi = this.client.getUmi();

    const [contractPDA] = umi.eddsa.findPda(PARTPAY_PROGRAM_ID, [
      Buffer.from("bnpl_contract"),
      new Pubkey(buyer).toBuffer(),
      new Pubkey(seller).toBuffer(),
    ]);

    const createContractInstruction = struct([
      ['discriminator', u64()],
      ['totalAmount', u64()],
      ['durationSeconds', i64()],
      ['installmentFrequency', u64()],
      ['insurancePremium', option(u64())],
    ]);

    const discriminator = Buffer.from([244, 48, 244, 178, 216, 88, 122, 52]);
    const serializedData = Buffer.concat([
      discriminator,
      createContractInstruction.serialize({
        discriminator: BigInt(0), // This is ignored due to the manually added discriminator
        totalAmount,
        durationSeconds: BigInt(durationSeconds),
        installmentFrequency,
        insurancePremium: insurancePremium ? { __option: 'Some', value: insurancePremium } : { __option: 'None' },
      }).slice(8) // Remove the first 8 bytes (discriminator) from the serialized data
    ]);

    const instruction: WrappedInstruction = {
      instruction: {
        programId: PARTPAY_PROGRAM_ID,
        keys: [
          { pubkey: contractPDA, isSigner: false, isWritable: true },
          { pubkey: buyer, isSigner: true, isWritable: true },
          { pubkey: seller, isSigner: false, isWritable: false },
          { pubkey: umi.programs.get("System").publicKey, isSigner: false, isWritable: false },
        ],
        data: serializedData,
      },
      signers: [umi.payer],
      bytesCreatedOnChain: 1000, // Adjust this value if you know the exact number of bytes created on-chain
    };

    const tx = transactionBuilder().add(instruction);

    await this.client.sendAndConfirmTransaction(tx);

    return contractPDA;
  }

  async makePayment(contractPDA: PublicKey, amount: bigint): Promise<string> {
    const umi = this.client.getUmi();

    const makePaymentInstruction = struct([
      ['discriminator', bytes({ size: 8 })],
      ['amount', u64()],
    ]);

    const discriminator = Buffer.from([19, 128, 153, 121, 221, 192, 91, 53]);
    const serializedData = makePaymentInstruction.serialize({
      discriminator: discriminator,
      amount,
    });

    const instruction: WrappedInstruction = {
      instruction: {
        programId: PARTPAY_PROGRAM_ID,
        keys: [
          { pubkey: contractPDA, isSigner: false, isWritable: true },
          { pubkey: umi.identity.publicKey, isSigner: true, isWritable: true },
          { pubkey: umi.payer.publicKey, isSigner: true, isWritable: true },
          { pubkey: umi.programs.get("System").publicKey, isSigner: false, isWritable: false },
        ],
        data: serializedData,
      },
      signers: [umi.payer],
      bytesCreatedOnChain: 0,
    };

    const tx = transactionBuilder().add(instruction);

    const signature = await this.client.sendAndConfirmTransaction(tx);

    return signature;
  }

  async getContractStatus(contractPDA: PublicKey): Promise<ContractData> {
    const umi = this.client.getUmi();

    const accountInfo = await umi.rpc.getAccount(contractPDA);

    if (!accountInfo.exists) {
      throw new Error(`Contract account ${contractPDA.toString()} does not exist`);
    }

    const data = accountInfo.data;
    let offset = 8; // Skip discriminator

    const buyer = publicKey(data.slice(offset, offset + 32));
    offset += 32;
    const seller = publicKey(data.slice(offset, offset + 32));
    offset += 32;
    const totalAmount = BigInt(new DataView(data.buffer).getBigUint64(offset, true));
    offset += 8;
    const amountPaid = BigInt(new DataView(data.buffer).getBigUint64(offset, true));
    offset += 8;
    const startDate = Number(new DataView(data.buffer).getBigInt64(offset, true));
    offset += 8;
    const endDate = Number(new DataView(data.buffer).getBigInt64(offset, true));
    offset += 8;
    const lastPaymentDate = Number(new DataView(data.buffer).getBigInt64(offset, true));
    offset += 8;
    const installmentFrequency = BigInt(new DataView(data.buffer).getBigUint64(offset, true));
    offset += 8;
    const isCompleted = data[offset] !== 0;
    offset += 1;
    const hasInsurancePremium = data[offset] !== 0;
    offset += 1;
    const insurancePremium = hasInsurancePremium ? BigInt(new DataView(data.buffer).getBigUint64(offset, true)) : null;
    offset += 8;
    const isInsured = data[offset] !== 0;

    return {
      buyer,
      seller,
      totalAmount,
      amountPaid,
      startDate,
      endDate,
      lastPaymentDate,
      installmentFrequency,
      isCompleted,
      insurancePremium,
      isInsured,
    };
  }
}
