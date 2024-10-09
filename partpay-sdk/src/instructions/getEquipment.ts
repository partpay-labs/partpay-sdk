import { Umi, PublicKey, publicKey } from "@metaplex-foundation/umi";
import { Equipment } from "../types";

function readUInt32LE(data: Uint8Array, offset: number): number {
  return (data[offset] |
    (data[offset + 1] << 8) |
    (data[offset + 2] << 16) |
    (data[offset + 3] << 24)) >>> 0;
}

function readBigUInt64LE(data: Uint8Array, offset: number): bigint {
  const lo = readUInt32LE(data, offset);
  const hi = readUInt32LE(data, offset + 4);
  return BigInt(lo) + (BigInt(hi) << 32n);
}

export async function getEquipment(umi: Umi, equipmentPubkey: PublicKey): Promise<Equipment> {
  try {
    const accountInfo = await umi.rpc.getAccount(equipmentPubkey);

    if (!accountInfo.exists) {
      throw new Error(`Equipment account ${equipmentPubkey.toString()} does not exist`);
    }

    // The first 8 bytes are the account discriminator
    const data = accountInfo.data.slice(8);

    // Deserialize the account data
    const vendorPubkey = publicKey(data.slice(0, 32));
    const assetPubkey = publicKey(data.slice(32, 64));

    let offset = 64;
    const nameLength = readUInt32LE(data, offset);
    offset += 4;
    const name = new TextDecoder().decode(data.slice(offset, offset + nameLength));
    offset += nameLength;

    const uriLength = readUInt32LE(data, offset);
    offset += 4;
    const uri = new TextDecoder().decode(data.slice(offset, offset + uriLength));
    offset += uriLength;

    const price = readBigUInt64LE(data, offset);

    const equipment: Equipment = {
      vendor: vendorPubkey,
      asset: assetPubkey,
      name,
      uri,
      price: price.toString(),
    };

    return equipment;
  } catch (error) {
    console.error("Error fetching equipment:", error);
    throw error;
  }
}