import { Umi, TransactionBuilder, generateSigner, PublicKey } from "@metaplex-foundation/umi";
import { PARTPAY_PROGRAM_ID } from "../constants";
import { AssetTransactionBuilder } from "../types/transaction";
import { PublicKey as Pubkeys } from "@solana/web3.js";
import { getVendor } from "./getVendor";

export const createEquipment = async(
  umi: Umi,
  vendorPubkey: PublicKey,
  params: {
    name: string;
    uri: string;
    price: bigint;
  }
): Promise<AssetTransactionBuilder> => {
  const equipmentSigner = generateSigner(umi);

  // Fetch the vendor account
  let vendor;
  try {
    vendor = await getVendor(umi, vendorPubkey);
  } catch (error) {
    throw new Error("Vendor account not found or not initialized");
  }

  if (!vendor) {
    throw new Error("Vendor account not found or not initialized");
  }

  const equipmentCount = vendor.equipmentCount;

  const [vendorPDA] = umi.eddsa.findPda(PARTPAY_PROGRAM_ID, [
    Buffer.from("vendor"),
    new Pubkeys(umi.identity.publicKey).toBuffer(),
    new Pubkeys(vendor.uniqueId).toBuffer(),
  ]);

  const [vendorCollectionPDA] = umi.eddsa.findPda(PARTPAY_PROGRAM_ID, [
    Buffer.from("vendor_collection"),
    new Pubkeys(vendorPDA).toBuffer()
  ]);

  const equipmentCountBuffer = Buffer.alloc(8);
  equipmentCountBuffer.writeBigUInt64LE(BigInt(equipmentCount));

  const [equipmentPDA] = umi.eddsa.findPda(PARTPAY_PROGRAM_ID, [
    Buffer.from("equipment"),
    new Pubkeys(vendorPDA).toBuffer(),
    equipmentCountBuffer,
  ]);

  const [equipmentAssetPDA] = umi.eddsa.findPda(PARTPAY_PROGRAM_ID, [
    Buffer.from("equipment_asset"),
    new Pubkeys(equipmentPDA).toBuffer(),
  ]);

  // Check if accounts exist
  const vendorAccountInfo = await umi.rpc.getAccount(vendorPDA);
  if (!vendorAccountInfo.exists) {
    throw new Error(`Vendor account ${vendorPDA.toString()} does not exist`);
  }

  const vendorCollectionAccountInfo = await umi.rpc.getAccount(vendorCollectionPDA);
  if (!vendorCollectionAccountInfo.exists) {
    throw new Error(`Vendor collection account ${vendorCollectionPDA.toString()} does not exist`);
  }

  const discriminator = Buffer.from([187, 74, 9, 22, 118, 122, 252, 76]);
  const nameBuffer = Buffer.from(params.name);
  const uriBuffer = Buffer.from(params.uri);

  const priceBuffer = Buffer.alloc(8);
  priceBuffer.writeBigUInt64LE(params.price);

  const serializedData = Buffer.concat([
    discriminator,
    Buffer.from(new Uint32Array([nameBuffer.length]).buffer),
    nameBuffer,
    Buffer.from(new Uint32Array([uriBuffer.length]).buffer),
    uriBuffer,
    priceBuffer,
  ]);

  const keys = [
    { pubkey: equipmentPDA, isSigner: false, isWritable: true },
    { pubkey: equipmentAssetPDA, isSigner: false, isWritable: true },
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
    assetPubkey: equipmentSigner,
    assetPda: equipmentPDA,
    transactionBuilder: transactionBuilder
  };
};