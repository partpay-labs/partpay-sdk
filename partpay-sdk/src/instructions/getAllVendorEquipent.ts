import { TransactionBuilder, PublicKey, Umi } from '@metaplex-foundation/umi';
import { PARTPAY_PROGRAM_ID } from '../constants'; // Constant representing the program ID of the deployed PartPay program
import { struct } from '@metaplex-foundation/umi/serializers'; // Utility for structuring and serializing data
import { extractEquipmentPubkeysFromResult } from '../helper/extractEquipmentPubkey'; // Helper function to extract equipment public keys from a transaction result
import { EquipmentPublicKey } from '../types/Equipment'; // Type definition for equipment public keys

/**
 * Fetches all equipment public keys associated with a given vendor.
 * 
 * @param umi - An instance of the Umi class, used for interacting with the blockchain
 * @param vendorPubkey - The public key of the vendor whose equipment is to be fetched
 * @returns A promise that resolves to an array of equipment public keys
 */
export const getAllVendorEquipments = async (
    umi: Umi,
    vendorPubkey: PublicKey
): Promise<EquipmentPublicKey[]> => {
    // Define the transaction instruction for fetching equipment
    const instruction = {
        programId: PARTPAY_PROGRAM_ID, // The ID of the PartPay program deployed on Solana
        keys: [
            { pubkey: vendorPubkey, isSigner: false, isWritable: false }, // Key for vendor identification
        ],
        data: struct([]).serialize({}), // Serialize the instruction data, empty in this case
    };

    // Create a transaction to send to the blockchain
    const builder = (new TransactionBuilder())
        .add({
            instruction, // Add the instruction to the transaction
            signers: [], // No additional signers required
            bytesCreatedOnChain: 0, // No additional bytes are created on-chain
        });

    // Send the transaction and wait for confirmation
    const result = await builder.sendAndConfirm(umi);
    
    // Extract the equipment public keys from the transaction result
    const equipmentPubkeys = extractEquipmentPubkeysFromResult(result);

    return equipmentPubkeys; // Return the extracted equipment public keys
};
