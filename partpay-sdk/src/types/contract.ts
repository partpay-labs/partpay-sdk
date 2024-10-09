import { PublicKey, Signer } from "@metaplex-foundation/umi";

export interface Contract {
    totalAmount: number; // in smallest currency unit (e.g., cents)
    durationSeconds: number;
    installmentFrequency: number; // in seconds
    insurancePremium?: number; // in smallest currency unit (e.g., cents)
  }

  export interface ContractData {
    buyer: PublicKey;
    seller: PublicKey;
    totalAmount: bigint;
    amountPaid: bigint;
    startDate: number;
    endDate: number;
    lastPaymentDate: number;
    installmentFrequency: bigint;
    isCompleted: boolean;
    insurancePremium: bigint | null;
    isInsured: boolean;
  }

  export interface ContractTransaction {
    assetPubkey: Signer;
    transaction: string;
  }