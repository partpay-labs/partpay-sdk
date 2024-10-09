import { PublicKey as Pubkeys } from "@solana/web3.js";
import { generateSigner, PublicKey, TransactionBuilder, Umi } from "@metaplex-foundation/umi";
import { PARTPAY_PROGRAM_ID } from "../constants";
import { AssetTransactionBuilder } from "../types/transaction";


export const createVendor = (
  umi: Umi,
  params: {
    name: string;
    uri: string;
    unique_id: PublicKey;
  }
): AssetTransactionBuilder => {
  const vendorSigner = generateSigner(umi);

  const [vendorPDA] = umi.eddsa.findPda(PARTPAY_PROGRAM_ID, [
    Buffer.from("vendor"),
    new Pubkeys(umi.identity.publicKey).toBuffer(),
    new Pubkeys(params.unique_id).toBuffer(),
  ]);

  const [vendorCollectionPDA] = umi.eddsa.findPda(PARTPAY_PROGRAM_ID, [
    Buffer.from("vendor_collection"),
    new Pubkeys(vendorPDA).toBuffer()
  ]);

  const discriminator = Buffer.from([32, 63, 115, 119, 35, 61, 109, 155]);
  const nameBuffer = Buffer.from(params.name);
  const uriBuffer = Buffer.from(params.uri);

  const serializedData = Buffer.concat([
    discriminator,
    Buffer.from(new Uint32Array([nameBuffer.length]).buffer),
    nameBuffer,
    Buffer.from(new Uint32Array([uriBuffer.length]).buffer),
    uriBuffer,
    new Pubkeys(params.unique_id).toBuffer()
  ]);

  const keys = [
    { pubkey: vendorPDA, isSigner: false, isWritable: true },
    { pubkey: vendorCollectionPDA, isSigner: false, isWritable: true },
    { pubkey: umi.identity.publicKey, isSigner: true, isWritable: false },
    { pubkey: umi.payer.publicKey, isSigner: true, isWritable: true },
    { pubkey: umi.programs.get("System").publicKey, isSigner: false, isWritable: false },
    { pubkey: umi.programs.get("mplCore").publicKey, isSigner: false, isWritable: false },
    { pubkey: umi.programs.get("rent").publicKey, isSigner: false, isWritable: false },
  ];

  const transactionBuilder = (new TransactionBuilder())
    .add({
      instruction: {
        programId: PARTPAY_PROGRAM_ID,
        keys: keys,
        data: serializedData,
      },
      signers: [],
      bytesCreatedOnChain: 1000,
    });

  return {
    assetPubkey: vendorSigner,
    transactionBuilder: transactionBuilder
  };
};