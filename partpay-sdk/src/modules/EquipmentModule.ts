import { PublicKey } from "@metaplex-foundation/umi";
import { PartPayClient } from "../hooked";
import { Equipment, EquipmentMetadata, EquipmentResult } from "../types";
import { createEquipment, getEquipment } from "../instructions";
import { metadataUploader } from "../helper";
import { MetaData } from "../types/metadata";


export class EquipmentModule {
  constructor(private client: PartPayClient) { }

  async createEquipment(vendorPubkey: PublicKey, metadata: EquipmentMetadata): Promise<EquipmentResult> {
    const umi = this.client.getUmi();
  
    // Wrap the EquipmentMetadata in a MetaData object
    const metaData: MetaData = {
      metadata: metadata
    };

    const uri = await metadataUploader(umi, metaData);
    const params = {
      name: metadata.name,
      uri,
      price: BigInt(metadata.price),
    };

    const equipmentTransactionBundler = createEquipment(umi, vendorPubkey, params);
    
    const transactionSignature = await this.client.sendAndConfirmTransaction((await equipmentTransactionBundler).transactionBuilder);
  
    if (!(await equipmentTransactionBundler).assetPubkey|| !(await equipmentTransactionBundler).assetPda) {
      throw new Error("Failed to create equipment: assetPubkey or assetPda is undefined");
    }
  
    return {
      assetPubkey: (await equipmentTransactionBundler).assetPubkey,
      assetPda: (await equipmentTransactionBundler).assetPda,
      transactionSignature,
    };
  }
  
  async getEquipment(equipmentPubkey: PublicKey): Promise<Equipment> {
    const umi = this.client.getUmi();
    return await getEquipment(umi, equipmentPubkey);
  }
}