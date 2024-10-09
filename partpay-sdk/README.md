# PartPay SDK

A TypeScript/JavaScript SDK for interacting with the PartPay protocol on the Solana blockchain.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Development](#development)
- [License](#license)

## Installation

```bash
npm install @partpay-libs/sdk

## Usage

```typescript
import { PartPayClient, VendorModule, EquipmentModule } from '@partpay-libs/sdk';

// Initialize client
const secretKey = new Uint8Array([/* your secret key */]);
const client = PartPayClient.create("https://api.devnet.solana.com", secretKey);

const vendorModule = new VendorModule(client);
const equipmentModule = new EquipmentModule(client);

// Create a vendor
async function createVendor() {
  const vendorMetadata = {
    owner: client.getUmi().identity.publicKey,
    name: "My Shop",
    image: "https://example.com/image.jpg",
    metadata: {}
  };
  return await vendorModule.createVendor(vendorMetadata);
}

// Create equipment
async function createEquipment(vendorPDA) {
  const equipmentMetadata = {
    name: "Test Equipment",
    description: "Test description",
    image: "https://example.com/equipment.jpg",
    price: "1000000",
    attributes: [
      { trait_type: "Category", value: "Test" },
      { trait_type: "Condition", value: "New" }
    ]
  };
  return await equipmentModule.createEquipment(vendorPDA, equipmentMetadata);
}

// Example usage
createVendor().then(vendor => {
  console.log("Vendor created:", vendor);
  return createEquipment(vendor.uniqueId);
}).then(equipment => {
  console.log("Equipment created:", equipment);
}).catch(console.error);