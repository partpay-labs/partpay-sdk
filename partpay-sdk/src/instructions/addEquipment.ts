import { TransactionBuilder, PublicKey, Umi, generateSigner } from '@metaplex-foundation/umi';
import { create, fetchCollection } from '@metaplex-foundation/mpl-core';
import { PARTPAY_PROGRAM_ID } from '../constants';
import { struct, string } from '@metaplex-foundation/umi/serializers';
import { metadataUploader } from '../helper/metadataUploader';
import { EquipmentMetadata } from '../types/Equipment';
import { MetaData } from '../types/metadata';

/**
 * Adds equipment to a vendor's collection.
 * This function handles the uploading of metadata and linking the new equipment to the specified vendor.
 *
 * @param umi - The Umi object used for blockchain interactions.
 * @param params - The parameters required to add equipment.
 * @param params.owner - The PublicKey of the owner of the equipment.
 * @param params.vendor - The PublicKey of the vendor's collection where the equipment will be added.
 * @param params.name - The name of the equipment.
 * @param params.metadata - Metadata describing the equipment's properties and characteristics.
 * @returns A TransactionBuilder that handles the creation of the equipment on-chain.
 */
export const addEquipment = async (
  umi: Umi,
  params: {
    owner: PublicKey;
    vendor: PublicKey;
    name: string;
    metadata: EquipmentMetadata;
  }
): Promise<TransactionBuilder> => {
  const metaData: MetaData = {
    metadata: params.metadata // Encapsulates the equipment metadata for upload.
  };

  const uri = await metadataUploader(umi, metaData); // Uploads metadata and returns a URI.

  const equipmentNft = generateSigner(umi); // Generates a signer for the new equipment NFT.
  const collection = await fetchCollection(umi, params.vendor); // Fetches the vendor's collection.

  return create(umi, {
    asset: equipmentNft, // The NFT asset representing the equipment.
    name: params.name, // Name of the equipment.
    uri: uri, // URI linking to the equipment metadata.
    collection: {
      publicKey: collection.publicKey, // Public key of the collection where the equipment is being added.
      oracles: collection.oracles, // Oracles associated with the collection.
      lifecycleHooks: collection.lifecycleHooks // Lifecycle hooks linked with the collection.
    },
  }).add({
    instruction: {
      programId: PARTPAY_PROGRAM_ID, // Program ID where the instruction will be executed.
      keys: [
        { pubkey: params.owner, isSigner: true, isWritable: true }, // Owner of the equipment.
        { pubkey: params.vendor, isSigner: false, isWritable: true }, // Vendor's collection to which the equipment is being added.
        { pubkey: equipmentNft.publicKey, isSigner: true, isWritable: true }, // The new equipment NFT.
        { pubkey: umi.payer.publicKey, isSigner: true, isWritable: true }, // The payer signing the transaction.
      ],
      data: struct([
        ['name', string()], // Name of the equipment serialized as a string.
        ['uri', string()], // URI of the metadata serialized as a string.
      ]).serialize({
        name: params.name, // Name of the equipment.
        uri: uri, // URI linking to the metadata.
      }),
    },
    signers: [equipmentNft], // Adds the equipment NFT signer to the transaction.
    bytesCreatedOnChain: 300, // Estimated bytes that will be created on-chain.
  });
};