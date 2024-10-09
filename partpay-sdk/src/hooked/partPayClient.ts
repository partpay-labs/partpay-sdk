// import {
//   PublicKey as UmiPublicKey,
//   TransactionBuilder,
//   TransactionSignature,
//   Umi,
//   keypairIdentity,
//   Cluster,
//   publicKey,
// } from "@metaplex-foundation/umi";
// import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// import { mplCore } from "@metaplex-foundation/mpl-core";
// import { partpayPlugin } from "../helper/partpayPlugin";
// import { base58 } from "@metaplex-foundation/umi/serializers";
// import { Connection, PublicKey as SolanaPublicKey } from "@solana/web3.js";

// import { createSigner } from "../helper/createSigner";
// import { PARTPAY_PROGRAM } from "../errors";

// /**
//  * PartPayClient is the main SDK class for interacting with the PartPay protocol.
import {
  PublicKey as UmiPublicKey,
  TransactionBuilder,
  TransactionSignature,
  Umi,
  keypairIdentity,
  Cluster,
  publicKey,
  UmiPlugin
} from "@metaplex-foundation/umi";
import { walletAdapterIdentity, WalletAdapter } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { partpayPlugin } from "../helper/partpayPlugin";
import { base58 } from "@metaplex-foundation/umi/serializers";

import { createSigner } from "../helper/createSigner";
import { PARTPAY_PROGRAM } from "../errors";

type PartPayClientOptions = {
  endpoint: string;
  wallet?: WalletAdapter;
  secretKey?: Uint8Array;
};

export class PartPayClient {
  private umi: Umi;
  private readonly baseUrl: string = 'https://api.partpay.xyz';

  private constructor(umi: Umi) {
    this.umi = umi;
  }

  static create(options: PartPayClientOptions): PartPayClient {
    if (!options.wallet && !options.secretKey) {
      throw new Error("Either wallet or secretKey must be provided");
    }

    const umi = createUmi(options.endpoint)
      .use(mplCore())
      .use(partpayPlugin())
      .use(PartPayClient.partPayPlugin);

    if (options.wallet) {
      umi.use(walletAdapterIdentity(options.wallet));
    } else if (options.secretKey) {
      const signer = createSigner(umi, options.secretKey);
      umi.use(keypairIdentity(signer));
    }

    return new PartPayClient(umi);
  }

  private static partPayPlugin: UmiPlugin = {
    install(umi: Umi) {
      // Register the System Program
      umi.programs.add({
        name: 'System',
        publicKey: publicKey('11111111111111111111111111111111'),
        getErrorFromCode: () => null,
        getErrorFromName: () => null,
        isOnCluster: (cluster: Cluster) => true,
      });

      // Register the Rent Program
      umi.programs.add({
        name: 'rent',
        publicKey: publicKey('SysvarRent111111111111111111111111111111111'),
        getErrorFromCode: () => null,
        getErrorFromName: () => null,
        isOnCluster: (cluster: Cluster) => true,
      });

      umi.programs.add(PARTPAY_PROGRAM);
    }
  };

  async getAccountInfo(pubkey: UmiPublicKey): Promise<any> {
    try {
      return await this.umi.rpc.getAccount(pubkey);
    } catch (error) {
      throw error;
    }
  }

  getUmi(): Umi {
    return this.umi;
  }

  async sendAndConfirmTransaction(transaction: TransactionBuilder): Promise<string> {
    const result = await transaction.sendAndConfirm(this.umi);
    return this.convertSignatureToString(result.signature);
  }

  convertSignatureToString(signature: TransactionSignature): string {
    return base58.deserialize(signature)[0];
  }
}