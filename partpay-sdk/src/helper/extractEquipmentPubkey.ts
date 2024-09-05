import { PublicKey } from '@metaplex-foundation/umi';
import { publicKey, array, Serializer } from "@metaplex-foundation/umi/serializers";
import { EquipmentPublicKey } from "../types/Equipment";

export function extractEquipmentPubkeysFromResult(result: any): EquipmentPublicKey[] {
  const returnData = result.getTransactionReturnData();
  if (!returnData) {
      throw new Error('No return data found in transaction result');
  }

  const [pubkeys] = array(publicKey() as Serializer<unknown, PublicKey>).deserialize(returnData);
  return pubkeys.map((pubkey: PublicKey) => ({ pubkey }));
}