import { PublicKey, Signer, TransactionBuilder } from "@metaplex-foundation/umi"

export type VendorTransaction = {
    assetPubkey: Signer,
    uniqueId?: Signer,
    transaction: string
}

export type AssetTransactionBuilder = {
    assetPubkey: Signer,
    uniqueId?: Signer,
    assetPda?: PublicKey,
    transactionBuilder: TransactionBuilder
}

// export type EquipmentTransactionBuilder = {
//     assetPubkey: Signer,
//     transactionBuilder: TransactionBuilder
// }

export interface EquipmentResult {
    assetPubkey: Signer;
    assetPda?: PublicKey,
    transactionSignature: string;
  }

export type VendorTransactionData = {
    name: string;
    uri: string;
    equipmentCount: number;
}

export type ContractTransactionBuilder = {
    assetPubkey: Signer,
    transactionBuilder: TransactionBuilder
}