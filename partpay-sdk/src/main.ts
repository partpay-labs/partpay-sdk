// // import { PartPayClient } from "./hooked";
// // import { VendorModule } from "./modules/vendorModule";
// // import { Vendor } from "./types";

import { publicKey } from "@metaplex-foundation/umi";
import { EquipmentMetadata, Vendor } from "./types";
import { EquipmentModule, VendorModule } from "./modules";
import { PartPayClient } from "./hooked";

// // async function createMyVendor() {
// //   try {
// //     const secretKey = new Uint8Array([1]);
// //     const client = PartPayClient.createWithUmi("https://api.devnet.solana.com", secretKey);

// //     const vendorModule = new VendorModule(client);

//     // const vendorMetadata: any = {
//     //   owner: client.getUmi().identity.publicKey,
//     //   name: "My Awesome Shop",
//     //   image: "https://example.com/shop-image.jpg",
//     //   metadata: {
//     //     // ... (rest of the metadata)
//     //   }
//     // };

// //     // // Create vendor without marketplace by explicitly passing null
// //     // const vendorTransaction = await vendorModule.createVendor(vendorMetadata);
// //     // console.log("Vendor created without marketplace:");
// //     // console.log("Transaction signature:", vendorTransaction.transaction);
// //     // console.log("Vendor asset public key:", vendorTransaction.assetPubkey.publicKey.toString());
// //     // console.log("Vendor unique ID:", vendorTransaction.uniqueId.publicKey.toString());

// //     BYbBdZgMvheBf2gPjjqats8pdgZh7BbjGthxZvbNriXE

// //   } catch (error) {
// //     console.error("Error creating vendor:", error);
// //   }
// // }

// // createMyVendor();


// // import { publicKey, PublicKey } from "@metaplex-foundation/umi";
// // import { PartPayClient } from "./hooked";
// // import { EquipmentModule } from "./modules/EquipmentModule";
// // import { EquipmentMetadata } from "./types";


// // async function testCreateAndGetEquipment() {
// //   try {
// //     // Initialize PartPayClient (make sure to use the correct endpoint and secret key)
// //     const secretKey = new Uint8Array([1]);
// //     const client = PartPayClient.createWithUmi("https://api.devnet.solana.com", secretKey);

// //     // Create an EquipmentModule instance
// //     const equipmentModule = new EquipmentModule(client);

// //     // Prepare the equipment metadata
// //     const equipmentMetadata: EquipmentMetadata = {
// //       name: "Test Equipment",
// //       description: "This is a test equipment",
// //       image: "https://example.com/equipment-image.jpg",
// //       price: "1000000", // Price in lamports (1 SOL = 1,000,000,000 lamports)
// //       attributes: [
// //         { trait_type: "Category", value: "Test" },
// //         { trait_type: "Condition", value: "New" }
// //       ]
// //     };

// //     // Replace this with an actual vendor public key
// //     const vendorPubkey = publicKey("E9cpwiF2pURnynUdzwMQT28AVr7wpineTvSwi4KBvSbv");

// //     // Create the equipment
// //     const equipmentCreationResult = await equipmentModule.createEquipment(vendorPubkey, equipmentMetadata);

// //     console.log("Equipment created successfully!");
// //     console.log("Transaction signature:", equipmentCreationResult.transactionSignature);
// //     console.log("Equipment asset public key:", equipmentCreationResult.assetPubkey.toString());

// //     // Fetch the created equipment data
// //     const fetchedEquipment = await equipmentModule.getEquipment(equipmentCreationResult.assetPubkey);
// //     console.log("Fetched equipment data:", fetchedEquipment);

// //     // Verify the fetched data
// //     console.assert(fetchedEquipment.name === equipmentMetadata.name, "Equipment name mismatch");
// //     console.assert(fetchedEquipment.price === equipmentMetadata.price, "Equipment price mismatch");
// //     // console.assert(fetchedEquipment.vendor.equals(vendorPubkey), "Equipment vendor mismatch");

// //     console.log("Equipment verification successful!");

// //   } catch (error) {
// //     console.error("Error in equipment test:", error);
// //   }
// // }

// // // Run the test
// // testCreateAndGetEquipment();

// import { PublicKey, publicKey, generateSigner } from "@metaplex-foundation/umi";
// import { PartPayClient } from "./hooked";
// import { VendorModule } from "./modules/vendorModule";
// import { EquipmentMetadata, Vendor } from "./types";
// import { EquipmentModule } from "./modules/EquipmentModule";

// async function testCreateAndGetEquipment() {
//   try {
//     // Initialize PartPayClient
//     const secretKey = new Uint8Array([1]);
//     const client = PartPayClient.createWithUmi("https://api.devnet.solana.com", secretKey);

//     // Create VendorModule and EquipmentModule instances
//     const vendorModule = new VendorModule(client);
//     const equipmentModule = new EquipmentModule(client);

//     // Create a vendor first
//     const vendorMetadata: any = {
//       owner: client.getUmi().identity.publicKey,
//       name: "My Awesome Shop",
//       image: "https://example.com/shop-image.jpg",
//       metadata: {
//         // ... (rest of the metadata)
//       }
//     };

//     const vendorTransaction = await vendorModule.createVendor(vendorMetadata);
//     console.log("Vendor created successfully!");
//     console.log("Vendor public key:", vendorTransaction.assetPubkey.publicKey.toString());

//     // Prepare the equipment metadata
//     const equipmentMetadata: EquipmentMetadata = {
//       name: "Test Equipment",
//       description: "This is a test equipment",
//       image: "https://example.com/equipment-image.jpg",
//       price: "1000000", // Price in lamports (1 SOL = 1,000,000,000 lamports)
//       attributes: [
//         { trait_type: "Category", value: "Test" },
//         { trait_type: "Condition", value: "New" }
//       ]
//     };

//     // Use the newly created vendor's public key
//     const vendorPubkey = vendorTransaction.assetPubkey.publicKey;

//     // Create the equipment
//     const equipmentCreationResult = await equipmentModule.createEquipment(vendorPubkey, equipmentMetadata);

//     console.log("Equipment created successfully!");
//     console.log("Transaction signature:", equipmentCreationResult.transactionSignature);
//     console.log("Equipment asset public key:", equipmentCreationResult.assetPubkey.toString());

//     // Fetch the created equipment data
//     const fetchedEquipment = await equipmentModule.getEquipment(equipmentCreationResult.assetPubkey);
//     console.log("Fetched equipment data:", fetchedEquipment);

//     // Verify the fetched data
//     console.assert(fetchedEquipment.name === equipmentMetadata.name, "Equipment name mismatch");
//     console.assert(fetchedEquipment.price === equipmentMetadata.price, "Equipment price mismatch");
//     // console.assert(fetchedEquipment.vendor.equals(vendorPubkey), "Equipment vendor mismatch");

//     console.log("Equipment verification successful!");

//   } catch (error) {
//     console.error("Error in equipment test:", error);
//   }
// }

// // Run the test
// testCreateAndGetEquipment();


// import { PublicKey, publicKey, generateSigner } from "@metaplex-foundation/umi";
// import { PartPayClient } from "./hooked";
// import { EquipmentModule } from "./modules/EquipmentModule";
// import { EquipmentMetadata, Vendor } from "./types";
// import { VendorModule } from "./modules/vendorModule";

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// async function testCreateAndGetEquipment() {
//   try {
//     // Initialize PartPayClient
//     const secretKey = new Uint8Array([105,32,85,169,218,184,209,151,42,76,48,122,78,4,137,219,107,245,85,220,88,101,142,129,20,110,203,168,104,212,22,192,66,209,116,133,76,178,48,36,210,49,63,18,145,132,253,160,42,180,191,243,96,221,238,166,57,73,52,177,140,99,224,55]);

//     const client = PartPayClient.create({
//       endpoint: 'https://api.devnet.solana.com',
//       secretKey: secretKey
//     });

//     // Create VendorModule and EquipmentModule instances
//     const vendorModule = new VendorModule(client);
//     const equipmentModule = new EquipmentModule(client);

//     // Create a vendor first
//     const vendorMetadata: Vendor = {
//       owner: client.getUmi().identity.publicKey,
//       name: "My Awesome Shop",
//       image: "https://example.com/shop-image.jpg",
//       metadata: {
//         // ... (rest of the metadata)
//       }
//     }

//     console.log("Creating vendor...");
//     const vendorTransaction = await vendorModule.createVendor(vendorMetadata);
//     if(!vendorTransaction.uniqueId){
//       console.error("Failed to create vendor: uniqueId is missing");
//       return;
//     }

//     await delay(100000);
//     console.log("Vendor created successfully!");
//     console.log("Vendor unique ID:", vendorTransaction.uniqueId.publicKey.toString());

//     // Get the vendor PDA
//     console.log("Getting vendor PDA...");
//     const vendorPDA = await vendorModule.getVendorPDA(vendorTransaction.uniqueId.publicKey);
//     console.log("Vendor PDA:", vendorPDA.toString());

//     // Fetch and verify the vendor data
//     console.log("Fetching vendor data...");
//     const vendorData = await vendorModule.getVendor(vendorPDA);
//     console.log("Fetched vendor data:", vendorData);

//     // Verify the vendor data
//     // console.assert(vendorData.name === vendorMetadata.name, "Vendor name mismatch");
//     // console.assert(vendorData.uniqueId.equals(vendorTransaction.uniqueId.publicKey), "Vendor unique ID mismatch");

//     // Prepare the equipment metadata
//     const equipmentMetadata: EquipmentMetadata = {
//       name: "Test Equipment",
//       description: "This is a test equipment",
//       image: "https://example.com/equipment-image.jpg",
//       price: "1000000", // Price in lamports (1 SOL = 1,000,000,000 lamports)
//       attributes: [
//         { trait_type: "Category", value: "Test" },
//         { trait_type: "Condition", value: "New" }
//       ]
//     };

//     // Create the equipment using the vendor's PDA
//     console.log("Creating equipment...");
//     const equipmentCreationResult = await equipmentModule.createEquipment(vendorPDA, equipmentMetadata);

//     console.log("Equipment created successfully!");
//     console.log("Transaction signature:", equipmentCreationResult.transactionSignature);
//     console.log("Equipment asset public key:", equipmentCreationResult.assetPubkey.toString());

//     await delay(100000);
//     // Fetch the created equipment data
//     console.log("Fetching equipment data...");
//     if(!equipmentCreationResult.assetPda){
//       console.log("equipmentCreationResult.assetPda")
//       return
//     }
//     const fetchedEquipment = await equipmentModule.getEquipment(equipmentCreationResult.assetPda);
//     console.log("Fetched equipment data:", fetchedEquipment);

//     // Verify the fetched data
//     console.assert(fetchedEquipment.name === equipmentMetadata.name, "Equipment name mismatch");
//     console.assert(fetchedEquipment.price === equipmentMetadata.price, "Equipment price mismatch");
//     // console.assert(fetchedEquipment.vendor.equals(vendorPDA), "Equipment vendor mismatch");

//     console.log("Equipment verification successful!");

//   } catch (error) {
//     console.error("Error in equipment test:", error);
//     if (error instanceof Error) {
//       console.error("Error message:", error.message);
//       console.error("Error stack:", error.stack);
//     }
//   }
// }

// // Run the test
// testCreateAndGetEquipment();



import { ContractModule } from "./modules/ContractModule";
import { Keypair } from "@solana/web3.js";

async function testContractOperations() {
  try {
    // Initialize PartPayClient
    const secretKey = new Uint8Array([195,232,41,16,105,215,179,247,156,8,211,124,5,242,215,253,35,232,92,3,84,26,6,168,74,60,132,204,199,242,213,12,189,197,78,76,1,171,201,132,108,94,102,60,111,188,89,52,228,30,29,133,39,124,255,59,4,213,164,48,219,78,58,189]);
    const client = PartPayClient.create({
  endpoint: 'https://api.devnet.solana.com',
  secretKey: secretKey
});

    // Create ContractModule instance
    const contractModule = new ContractModule(client);

    // Create a new contract
    const buyer = client.getUmi().identity.publicKey;
    const seller = Keypair.generate(); // For testing purposes, generate a random seller
    const totalAmount = BigInt(1000000000); // 1 SOL
    const durationSeconds = 30 * 24 * 60 * 60; // 30 days
    const installmentFrequency = BigInt(7 * 24 * 60 * 60); // 7 days
    const insurancePremium = BigInt(58000000); // 0.05 SOL

    console.log("Creating contract...");
    console.log("Buyer:", buyer.toString());
    console.log("Seller:", seller.publicKey.toString());
    console.log("Total Amount:", totalAmount.toString());
    console.log("Duration (seconds):", durationSeconds);
    console.log("Installment Frequency:", installmentFrequency.toString());
    console.log("Insurance Premium:", insurancePremium.toString());

    try {
      const contractPDA = await contractModule.createContract(
        buyer,
        publicKey(seller.publicKey),
        totalAmount,
        durationSeconds,
        installmentFrequency,
        insurancePremium
      );
      console.log("Contract created successfully!");
      console.log("Contract PDA:", contractPDA.toString());

      // Get initial contract status
      console.log("\nFetching initial contract status...");
      let contractStatus = await contractModule.getContractStatus(contractPDA);
      console.log("Initial contract status:", contractStatus);

      // Make a payment
      const paymentAmount = BigInt(250000000); // 0.25 SOL
      console.log("\nMaking payment of", paymentAmount.toString(), "lamports...");
      try {
        const paymentTx = await contractModule.makePayment(publicKey("F3gikB6M5Q8NFtU8M4Kxj5PaYuVW3pUhimE2EW1Ke44p"), paymentAmount);
        console.log("Payment made successfully!");
        console.log("Payment transaction signature:", paymentTx);

        // Get updated contract status
        console.log("\nFetching updated contract status...");
        contractStatus = await contractModule.getContractStatus(contractPDA);
        console.log("Updated contract status:", contractStatus);
      } catch (paymentError) {
        console.error("Error making payment:", paymentError);
        if (paymentError instanceof Error) {
          console.error("Payment error message:", paymentError.message);
          console.error("Payment error stack:", paymentError.stack);
        }
      }
    } catch (contractError) {
      console.error("Error in contract creation or interaction:", contractError);
      if (contractError instanceof Error) {
        console.error("Contract error message:", contractError.message);
        console.error("Contract error stack:", contractError.stack);
      }
    }

  } catch (error) {
    console.error("Error in contract operations test:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
  }
}

// Run the test
testContractOperations();

// import { getAllVendorEquipment } from "./instructions";

// async function fetchAndDisplayVendorEquipment() {
//   try {
//     const secretKey = new Uint8Array([105,32,85,169,218,184,209,151,42,76,48,122,78,4,137,219,107,245,85,220,88,101,142,129,20,110,203,168,104,212,22,192,66,209,116,133,76,178,48,36,210,49,63,18,145,132,253,160,42,180,191,243,96,221,238,166,57,73,52,177,140,99,224,55]);

// const client = PartPayClient.create({
//   endpoint: 'https://api.devnet.solana.com',
//   secretKey: secretKey
// });

//     const vendorPublicKey = publicKey("3sV9cf19YRD5wxzVP5ifcXmpBXZPWzawDNf4XAx84kfr");
    
    
//     const allEquipment = await getAllVendorEquipment(client.getUmi(), vendorPublicKey);
    
//     allEquipment.forEach((equipment, index) => {
//       console.log(`Equipment ${index + 1}:`);
//       console.log(`  Name: ${equipment.name}`);
//       console.log(`  Price: ${equipment.price.toString()} lamports`);
//       console.log(`  URI: ${equipment.uri}`);
//       console.log(`  Asset: ${equipment.asset.toString()}`);
//       console.log('---');
//     });

//   } catch (error) {
//     console.error("Error fetching vendor equipment:", error);
//   }
// }

// fetchAndDisplayVendorEquipment();