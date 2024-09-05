import { PublicKey } from "@metaplex-foundation/umi";

/**
 * Represents the result of creating a vendor on the platform.
 * This includes the associated collection's public key and the transaction signature.
 */
export interface VendorCreationResult {
  collectionPubkey: PublicKey; // The public key of the vendor's collection, used to identify the vendor's on-chain assets.
  transactionSignature: string; // The transaction signature returned after creating the vendor, used for tracking and verification.
}
