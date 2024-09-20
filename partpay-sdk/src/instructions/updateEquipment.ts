import { TransactionBuilder, PublicKey, Umi } from '@metaplex-foundation/umi';
import { update, fetchAsset } from '@metaplex-foundation/mpl-core';
import { PARTPAY_PROGRAM_ID } from '../constants';
import { struct, string } from '@metaplex-foundation/umi/serializers';
import { EquipmentMetadata, MetaData } from '../types';
import { metadataUploader } from '../helper';

/**
 * Updates the metadata URI of an equipment asset on the blockchain.
 * 
 * @param umi - Umi client instance for interacting with the blockchain.
 * @param params - Object containing the equipment's public key and the new URI.
 * @returns A TransactionBuilder object that represents the update operation.
 */
export const updateEquipment = async (
  umi: Umi,
  params: {
    equipmentPubKey: PublicKey; // Public key of the equipment to be updated.
    metadata: EquipmentMetadata;
  }
): Promise<TransactionBuilder> => {
  // Fetch the full asset information using the equipment's public key.
  const asset = await fetchAsset(umi, params.equipmentPubKey);

  const metaData: MetaData = {
    metadata: params.metadata // Encapsulates the equipment metadata for upload.
  };

  const newUri = await metadataUploader(umi, metaData);

  // Use the update function to create a transaction that updates the asset's metadata URI.
  return update(umi, {
    asset: asset,       // The asset to be updated.
    uri: newUri, // The new URI to update the asset with.
  }).add({
    instruction: {
      programId: PARTPAY_PROGRAM_ID, // ID of the program managing the update.
      keys: [
        { pubkey: params.equipmentPubKey, isSigner: false, isWritable: true }, // Equipment's public key.
        { pubkey: umi.payer.publicKey, isSigner: true, isWritable: true }, // Signer's public key.
      ],
      data: struct([
        ['newUri', string()], // Data structure defining the new URI string.
      ]).serialize({
        newUri: newUri, // Serialize the new URI into the transaction data.
      }),
    },
    signers: [], // List of signers required for the transaction.
    bytesCreatedOnChain: 0, // No extra bytes are created on the chain.
  });
};
