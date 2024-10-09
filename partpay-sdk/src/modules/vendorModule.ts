import { generateSigner, PublicKey, publicKey } from "@metaplex-foundation/umi";
import { PartPayClient } from "../hooked";
import { Vendor, VendorData } from "../types";
import { createVendor, getVendor } from "../instructions";
import { VendorTransaction } from "../types/transaction";
import { metadataUploader } from "../helper";
import { PARTPAY_PROGRAM_ID } from "../constants";
import { PublicKey as Pubkey} from "@solana/web3.js";

export class VendorModule {
  constructor(private client: PartPayClient) { }

  async createVendor(metadata: Vendor): Promise<VendorTransaction> {
    const umi = this.client.getUmi();

    const metaData = {
      metadata: metadata
    };
  
    const uri = await metadataUploader(umi, metaData);
    const uniqueId = generateSigner(umi);
    const params = {
      name: metadata.name,
      uri,
      unique_id: uniqueId.publicKey,
    };

    const vendorTransactionBundler = createVendor(umi, params);
    
    const transaction = await this.client.sendAndConfirmTransaction(vendorTransactionBundler.transactionBuilder);
  
    return {
      assetPubkey: vendorTransactionBundler.assetPubkey,
      uniqueId: uniqueId,
      transaction: transaction
    };
  }
  
  async getVendor(vendorPubkey: PublicKey): Promise<any> {
    const umi = this.client.getUmi();
    return await getVendor(umi, vendorPubkey);
  }

  async getVendorPDA(uniqueId: PublicKey): Promise<PublicKey> {
    const umi = this.client.getUmi();
    const [vendorPDA] = umi.eddsa.findPda(PARTPAY_PROGRAM_ID, [
      Buffer.from("vendor"),
      new Pubkey(umi.identity.publicKey).toBuffer(),
      new Pubkey(uniqueId).toBuffer(),
    ]);
    return vendorPDA;
  }
}