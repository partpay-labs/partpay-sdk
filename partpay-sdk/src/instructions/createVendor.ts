import { TransactionBuilder, PublicKey, Umi, generateSigner } from '@metaplex-foundation/umi';
import { createCollection } from '@metaplex-foundation/mpl-core'; // Function to create NFT collections
import { PARTPAY_PROGRAM_ID } from '../constants'; // Constant representing the PartPay program ID
import { struct, string } from '@metaplex-foundation/umi/serializers'; // Utilities for structuring and serializing data
import { metadataUploader } from '../helper/metadataUploader'; // Helper to upload vendor metadata
import { Vendor } from '../types/Vendor'; // Type definition for vendor metadata

/**
 * Creates a new vendor by minting a collection NFT with the vendor's metadata.
 * 
 * @param umi - An instance of Umi for blockchain interactions
 * @param params - Object containing the owner's public key, vendor name, and metadata
 * @returns A TransactionBuilder to manage the vendor creation process
 */
export const createVendor = async (
  umi: Umi,
  params: {
    owner: PublicKey; // Public key of the vendor's owner
    name: string; // Name of the vendor
    metadata: Vendor; // Vendor metadata including shop details
  }
): Promise<TransactionBuilder> => {
  // Upload vendor metadata and get the URI
  const uri = await metadataUploader(umi, params.metadata);

  // Generate new signers for the collection NFT and vendor
  const collectionNft = generateSigner(umi);
  const vendor = generateSigner(umi);

  // Create a new collection on-chain representing the vendor
  return createCollection(umi, {
    collection: collectionNft, // Collection signer generated for this vendor
    name: params.name, // Vendor's name
    uri: uri, // Metadata URI generated from the uploaded data
  }).add({
    instruction: {
      programId: PARTPAY_PROGRAM_ID, // Program ID for the PartPay protocol
      keys: [
        { pubkey: params.owner, isSigner: true, isWritable: true }, // Owner of the vendor collection
        { pubkey: vendor.publicKey, isSigner: true, isWritable: true }, // Vendor's public key signer
        { pubkey: collectionNft.publicKey, isSigner: false, isWritable: false }, // Collection NFT's public key
        { pubkey: umi.payer.publicKey, isSigner: true, isWritable: true }, // Payer of the transaction
      ],
      data: struct([
        ['name', string()], // Define structure for the vendor's name
        ['uri', string()], // Define structure for the metadata URI
      ]).serialize({
        name: params.name, // Provide the vendor's name
        uri: uri, // Provide the metadata URI
      }),
    },
    signers: [vendor, collectionNft], // Signers required for the transaction
    bytesCreatedOnChain: 380, // Bytes consumed on-chain by the vendor creation process
  });
};
