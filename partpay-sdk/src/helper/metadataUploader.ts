import { publicKey, Umi } from "@metaplex-foundation/umi";
import { MetaData } from "../types/metadata";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

/**
 * Uploads metadata to a decentralized storage solution using Umi's uploader.
 * @param umi - The Umi client instance.
 * @param metadata - The metadata object to upload.
 * @returns The URI of the uploaded metadata.
 * @throws Error if there is an insufficient balance or if the upload fails.
 */
export const metadataUploader = async (umi: Umi, metadata: MetaData): Promise<string> => {
    // Initialize the uploader
    umi.use(irysUploader());

    // Fetch the current balance of the identity's public key
    const balance = await umi.rpc.getBalance(publicKey(umi.identity));

    // Check for sufficient balance and uploader initialization
    if (balance.basisPoints <= BigInt(1)) {
        throw new Error("Insufficient balance to perform upload.");
    }

    if (!umi.uploader) {
        throw new Error("Uploader is not initialized.");
    }

    // Attempt to upload the metadata JSON and obtain the URI
    const uri = await umi.uploader.uploadJson(metadata);

    // Validate the upload result
    if (!uri) {
        throw new Error("Failed to upload metadata.");
    }

    return uri;
};
