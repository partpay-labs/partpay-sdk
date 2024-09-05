import { TransactionBuilder, PublicKey, Umi } from '@metaplex-foundation/umi';
import { PARTPAY_PROGRAM_ID } from '../constants';
import { struct, u64, publicKey } from '@metaplex-foundation/umi/serializers';

/**
 * Retrieves vendor data from the blockchain.
 * 
 * @param umi - Umi client instance for interacting with the blockchain.
 * @param vendorPubkey - Public key of the vendor to retrieve.
 * @returns A VendorData object containing the vendor's details.
 */
export interface VendorData {
  owner: PublicKey;           // Public key of the vendor's owner.
  collectionAddress: PublicKey; // Public key of the vendor's collection.
  equipmentCount: bigint;     // Number of equipment associated with the vendor.
}

export const getVendor = async (
  umi: Umi,
  vendorPubkey: PublicKey
): Promise<VendorData> => {
  const instruction = {
    programId: PARTPAY_PROGRAM_ID, // Program ID responsible for managing vendor data.
    keys: [
      { pubkey: vendorPubkey, isSigner: false, isWritable: false }, // Public key of the vendor.
    ],
    data: struct([]).serialize({}), // Serialize an empty data structure as no input is required.
  };

  // Build and send the transaction to fetch vendor data.
  const builder = (new TransactionBuilder())
    .add({
      instruction,
      signers: [], // No additional signers needed for fetching data.
      bytesCreatedOnChain: 0, // No extra data written to the chain.
    });

  const result = await builder.sendAndConfirm(umi);

  // Check for transaction errors and handle them.
  if (result.result.value.err) {
    throw new Error(`Transaction failed: ${JSON.stringify(result.result.value.err)}`);
  }

  // Fetch the vendor account data separately using the public key.
  const accountInfo = await umi.rpc.getAccount(vendorPubkey);
  if (!accountInfo.exists) {
    throw new Error('Vendor account does not exist');
  }

  // Deserialize the fetched data into VendorData format.
  const vendorSerializer = struct([
    ['owner', publicKey()],
    ['collection_address', publicKey()],
    ['equipment_count', u64()],
  ]);

  const [vendorData] = vendorSerializer.deserialize(accountInfo.data);

  // Return the vendor data including owner, collection address, and equipment count.
  return {
    owner: vendorData.owner,
    collectionAddress: vendorData.collection_address,
    equipmentCount: vendorData.equipment_count,
  };
};
