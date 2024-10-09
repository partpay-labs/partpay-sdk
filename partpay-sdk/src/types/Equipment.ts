import { PublicKey } from "@metaplex-foundation/umi";

/**
 * Represents detailed metadata for equipment.
 * This includes various attributes like ownership, pricing, stock status, and physical characteristics.
 */

export interface Equipment {
  vendor: PublicKey;
  asset: PublicKey;
  name: string;
  uri: string;
  price: string; // We use string to represent u64 from Rust, as JavaScript doesn't have a native u64 type
}
export interface Equipment {
  vendor: PublicKey;
  asset: PublicKey;
  name: string;
  uri: string;
  price: string;
}

export interface EquipmentData extends Equipment {
  pubkey: PublicKey;
  vendor: PublicKey;
  asset: PublicKey;
}

export interface EquipmentMetadata {
  name: string;
  description: string;
  image: string;
  price: string;
  metadata?: Record<string, any>
  attributes?: Array<{ trait_type: string; value: string }>;
}


// export interface equipmentResult {
//   vendor: PublicKey;
//   asset: PublicKey;
//   name: string;
//   uri: string;
//   price: string;
//   metadata?: Record<string, any>
//   attributes?: Array<{ trait_type: string; value: string }>;
// }