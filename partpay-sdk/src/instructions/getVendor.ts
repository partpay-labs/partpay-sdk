import { Umi, PublicKey, publicKey } from "@metaplex-foundation/umi";
import { deserializeVendorAccount } from "../account/vendorAccount";
import { VendorData } from "../types";

export async function getVendor(umi: Umi, vendorPubkey: PublicKey): Promise<VendorData> {
  
  try {
    const accountInfo = await umi.rpc.getAccount(vendorPubkey);
    
    if (!accountInfo.exists) {
      console.error("Vendor account does not exist");
      throw new Error(`Vendor account ${vendorPubkey.toString()} does not exist`);
    }
    
    const vendorAccount = deserializeVendorAccount(Buffer.from(accountInfo.data));
    return {
      authority: publicKey(vendorAccount.authority.toBuffer()),
      collection: publicKey(vendorAccount.collection.toBuffer()),
      name: vendorAccount.name,
      uri: vendorAccount.uri,
      // marketplace: vendorAccount.marketplace ? publicKey(vendorAccount.marketplace.toBuffer()) : null,
      equipmentCount: Number(vendorAccount.equipmentCount),
      uniqueId: publicKey(vendorAccount.uniqueId.toBuffer())
    };
  } catch (error) {
    console.error("Error fetching vendor account:", error);
    throw error;
  }
}