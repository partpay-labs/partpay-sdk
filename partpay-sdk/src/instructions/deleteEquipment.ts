import { TransactionBuilder, PublicKey, Umi } from '@metaplex-foundation/umi';
import { burn, fetchAsset } from '@metaplex-foundation/mpl-core'; // Core Metaplex methods for asset management
import { PARTPAY_PROGRAM_ID } from '../constants'; // Program ID for the PartPay protocol
import { struct } from '@metaplex-foundation/umi/serializers';

/**
 * Deletes an equipment NFT by burning it.
 * 
 * @param umi - An instance of Umi for blockchain interactions
 * @param params - Object containing the public keys for the equipment and vendor
 * @returns A TransactionBuilder instance to manage the burn transaction
 */
export const deleteEquipment = async (
  umi: Umi,
  params: {
    equipment: PublicKey; // Public key of the equipment to be burned
    vendor: PublicKey; // Public key of the vendor owning the equipment
  }
): Promise<TransactionBuilder> => {
  // Fetch the asset associated with the provided equipment public key
  const asset = await fetchAsset(umi, params.equipment);

  // Create a burn transaction for the asset
  return burn(umi, {
    asset: asset,
  }).add({
    instruction: {
      programId: PARTPAY_PROGRAM_ID, // Program ID for executing the burn instruction
      keys: [
        { pubkey: umi.payer.publicKey, isSigner: true, isWritable: true }, // Wallet paying for the transaction
        { pubkey: params.vendor, isSigner: false, isWritable: true }, // Vendor's public key
        { pubkey: params.equipment, isSigner: false, isWritable: true }, // Equipment's public key to be burned
      ],
      data: struct([]).serialize({}), // Serialize empty data as required by the instruction format
    },
    signers: [], // No additional signers required for this operation
    bytesCreatedOnChain: 0, // No bytes are created on-chain during the burn operation
  });
};
