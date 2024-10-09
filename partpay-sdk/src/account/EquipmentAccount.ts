import { publicKey, PublicKey } from "@metaplex-foundation/umi";

// Define the DeserializedEquipment interface
export interface DeserializedEquipment {
  vendor: PublicKey;
  asset: PublicKey;
  name: string;
  uri: string;
  price: bigint;
}

// Implement the deserializeEquipment function
export function deserializeEquipment(buffer: Buffer): DeserializedEquipment {
  let offset = 8; // Skip the 8-byte discriminator

  function readPubkey(): PublicKey {
    const pubkeyBytes = buffer.slice(offset, offset + 32);
    offset += 32;
    return publicKey(pubkeyBytes);
  }

  function readString(): string {
    const len = buffer.readUInt32LE(offset);
    offset += 4;
    const str = buffer.slice(offset, offset + len).toString('utf8');
    offset += len;
    return str;
  }

  function readU64(): bigint {
    const value = buffer.readBigUInt64LE(offset);
    offset += 8;
    return value;
  }

  const vendor = readPubkey();
  const asset = readPubkey();
  const name = readString();
  const uri = readString();
  const price = readU64();

  return {
    vendor,
    asset,
    name,
    uri,
    price
  };
}