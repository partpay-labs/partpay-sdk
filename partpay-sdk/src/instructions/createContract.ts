import { Umi, TransactionBuilder, generateSigner, PublicKey } from "@metaplex-foundation/umi";
import { PARTPAY_PROGRAM_ID } from "../constants";
import { ContractTransactionBuilder } from "../types/transaction";
import { PublicKey as Pubkeys } from "@solana/web3.js";

export const createContract = (
  umi: Umi,
  buyer: PublicKey,
  seller: PublicKey,
  params: {
    totalAmount: number;
    durationSeconds: number;
    installmentFrequency: number;
    insurancePremium?: number;
  }
): ContractTransactionBuilder => {
  const contractSigner = generateSigner(umi);

  const [contractPDA] = umi.eddsa.findPda(PARTPAY_PROGRAM_ID, [
    Buffer.from("bnpl_contract"),
    new Pubkeys(buyer).toBuffer(),
    new Pubkeys(seller).toBuffer(),
  ]);

  const discriminator = Buffer.from([244, 48, 244, 178, 216, 88, 122, 52]);
  const totalAmountBuffer = Buffer.alloc(8);
  totalAmountBuffer.writeBigUInt64LE(BigInt(params.totalAmount));
  const durationBuffer = Buffer.alloc(8);
  durationBuffer.writeBigInt64LE(BigInt(params.durationSeconds));
  const frequencyBuffer = Buffer.alloc(8);
  frequencyBuffer.writeBigUInt64LE(BigInt(params.installmentFrequency));
  
  let insuranceBuffer: Buffer;
  if (params.insurancePremium !== undefined) {
    const premiumBuffer = Buffer.alloc(8);
    premiumBuffer.writeBigUInt64LE(BigInt(params.insurancePremium));
    insuranceBuffer = Buffer.concat([Buffer.from([1]), premiumBuffer]);
  } else {
    insuranceBuffer = Buffer.from([0]);
  }

  const serializedData = Buffer.concat([
    discriminator,
    totalAmountBuffer,
    durationBuffer,
    frequencyBuffer,
    insuranceBuffer,
  ]);

  const keys = [
    { pubkey: contractPDA, isSigner: false, isWritable: true },
    { pubkey: buyer, isSigner: true, isWritable: true },
    { pubkey: seller, isSigner: false, isWritable: false },
    { pubkey: umi.programs.get("System").publicKey, isSigner: false, isWritable: false },
  ];

  const transactionBuilder = (new TransactionBuilder())
    .add({
      instruction: {
        programId: PARTPAY_PROGRAM_ID,
        keys: keys,
        data: serializedData,
      },
      signers: [contractSigner],
      bytesCreatedOnChain: 1000,
    });

  const contractTransaction: ContractTransactionBuilder = {
    assetPubkey: contractSigner,
    transactionBuilder: transactionBuilder
  }

  return contractTransaction;
};