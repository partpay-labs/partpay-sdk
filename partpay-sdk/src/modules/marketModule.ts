import { PartPayClient } from "../hooked";
import { Marketplace } from "../types/market";
import { createMarketplace } from "../instructions/createMarket";
import { MetaData } from "../types";
import { metadataUploader } from "../helper";
import { TransactionBuilder } from "@metaplex-foundation/umi";

export class MarketplaceModule {
  constructor(private client: PartPayClient) {}

  async createMarketBuilder(metadata: Marketplace): Promise<string> {
    const umi = this.client.getUmi();

    const metaData: MetaData = {
      metadata: metadata
    };

    try {
      const uri = await metadataUploader(umi, metaData);
      const transaction = createMarketplace(umi, { name: metadata.name, uri });
      return await this.client.sendAndConfirmTransaction(transaction);
    } catch (error) {
      console.error("Error in createMarketBuilder:", error);
      throw error;
    }
  }

  async createMarketplaceTransaction(metadata: Marketplace): Promise<TransactionBuilder> {
    const umi = this.client.getUmi();

    const metaData: MetaData = {
      metadata: metadata
    };

    const uri = await metadataUploader(umi, metaData);
    return createMarketplace(umi, { name: metadata.name, uri });
  }
    
  // ... (other marketplace-related methods)
}
