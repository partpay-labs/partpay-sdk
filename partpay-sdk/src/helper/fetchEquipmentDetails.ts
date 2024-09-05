import { Umi } from "@metaplex-foundation/umi";
import { EquipmentPublicKey, EquipmentMetadata } from "../types/Equipment";
import { deserializeEquipment } from "./deserializeEquipment";

export const fetchEquipmentDetails = async (
    umi: Umi,
    equipmentPubkeys: EquipmentPublicKey[]
  ): Promise<EquipmentMetadata[]> => {
    const equipmentDetails: EquipmentMetadata[] = [];
  
    for (const { pubkey } of equipmentPubkeys) {
      const accountInfo = await umi.rpc.getAccount(pubkey);
      if (accountInfo.exists) {
        const equipment = deserializeEquipment(accountInfo.data);
        equipmentDetails.push(equipment);
      }
    }
  
    return equipmentDetails;
  };