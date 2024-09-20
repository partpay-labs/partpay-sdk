// import { publicKey } from "@metaplex-foundation/umi";
// import dotenv from 'dotenv';
// import { PartPayClient } from "./hooked";
// import { VendorStatus } from "./types";

// dotenv.config();

// async function testPartPaySDK() {
//     try {
//         const endpoint = process.env.SOLANA_ENDPOINT || 'https://api.devnet.solana.com';
//         const secretKey = new Uint8Array(JSON.parse(process.env.SECRET_KEY || '[]'));
        
//         if (secretKey.length === 0) {
//             throw new Error('Secret key not found in environment variables');
//         }

//         const client = await PartPayClient.createWithUmi(endpoint, secretKey);
        
//         const ownerPublicKey = publicKey(process.env.OWNER_PUBLIC_KEY || '');
//         const vendorTransaction = await client.createVendor({
//             owner: ownerPublicKey,
//             name: "Test Vendor",
//             metadata: {
//                 shopName: "Test Vendor",
//                 status: VendorStatus.Active
//             }
//         });

//         const vendorSignature = await client.sendAndConfirmTransaction(vendorTransaction);
//         console.log('Vendor created with signature:', vendorSignature);

//         // Add more tests for other SDK functions here

//     } catch (error) {
//         console.error('An error occurred:', error);
//     }
// }

// testPartPaySDK();

console.log("Hello world....")