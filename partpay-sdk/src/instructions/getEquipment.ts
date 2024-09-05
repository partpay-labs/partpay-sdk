import { TransactionBuilder, PublicKey, Umi } from '@metaplex-foundation/umi';
import { PARTPAY_PROGRAM_ID } from '../constants';
import { struct } from '@metaplex-foundation/umi/serializers';
import { EquipmentMetadata } from '../types/Equipment';
import { deserializeEquipment } from '../helper/deserializeEquipment';

/**
 * Retrieves equipment metadata from the blockchain.
 * 
 * @param umi - Umi client instance for interacting with the blockchain.
 * @param equipmentPubkey - Public key of the equipment to retrieve.
 * @returns An EquipmentMetadata object containing detailed metadata of the equipment.
 */
export const getEquipment = async (
  umi: Umi,
  equipmentPubkey: PublicKey
): Promise<EquipmentMetadata> => {
  const instruction = {
    programId: PARTPAY_PROGRAM_ID, // Program ID responsible for managing equipment data.
    keys: [
      { pubkey: equipmentPubkey, isSigner: false, isWritable: false }, // Public key of the equipment.
    ],
    data: struct([]).serialize({}), // Serialize an empty data structure as no input is required.
  };

  // Build and send the transaction to fetch equipment data.
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

  // Fetch the equipment account data separately using the public key.
  const accountInfo = await umi.rpc.getAccount(equipmentPubkey);
  if (!accountInfo.exists) {
    throw new Error('Equipment account does not exist');
  }

  // Deserialize the fetched data into EquipmentMetadata format using a helper function.
  return deserializeEquipment(accountInfo.data);
};
