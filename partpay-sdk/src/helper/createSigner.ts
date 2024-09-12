import { createSignerFromKeypair, publicKey, Umi } from "@metaplex-foundation/umi";
import { Keypair } from "@solana/web3.js";

export const createSigner = (umi: Umi, secretKey: Uint8Array) => {
    const privateKey = Keypair.fromSecretKey(secretKey)

    const keypair = {
        publicKey: publicKey(privateKey.publicKey),
        secretKey: privateKey.secretKey
    }

    const signer = createSignerFromKeypair(umi, keypair)

    return signer
}