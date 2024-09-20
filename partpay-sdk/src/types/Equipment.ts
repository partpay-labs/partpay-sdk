import { PublicKey } from "@metaplex-foundation/umi";

/**
 * Represents detailed metadata for equipment.
 * This includes various attributes like ownership, pricing, stock status, and physical characteristics.
 */
export interface EquipmentMetadata {
  name: string; // Name of the equipment item.
  description: string; // Detailed description of the equipment.
  sku?: string; // Optional SKU (Stock Keeping Unit) for inventory tracking.
  category?: string; // Optional category for grouping similar equipment.
  brand?: string; // Optional brand name of the equipment.

  owner: PublicKey; // PublicKey of the equipment owner.
  vendorId: PublicKey; // PublicKey of the associated vendor.
  walletAddress: PublicKey; // Wallet address associated with the equipment, likely used for transactions.

  price: number; // Base price of the equipment.
  currency: string; // Currency used for pricing (e.g., USD, SOL).
  installmentPrice?: number; // Optional price for installment payments.
  maxNumberOfInstallments?: number; // Maximum allowed installment payments.
  minimumInstallmentPrice?: number; // Minimum price allowed installment payments.
  maxPaymentDuration?: number; // Maximum payment duration in days or months.

  stockQuantity: number; // Number of items available in stock.
  isActive: boolean; // Indicates whether the equipment is active and available for purchase.

  // Physical attributes of the equipment
  images: string[]; // Array of URLs pointing to images of the equipment.
  image: string; // Primary image URL.
  weight?: number; // Optional weight of the equipment.
  dimensions?: { // Optional dimensions of the equipment, including length, width, height, and unit.
    length: number;
    width: number;
    height: number;
    unit: string; // Unit of measurement (e.g., cm, inches).
  };

  condition?: 'new' | 'used' | 'refurbished'; // Optional condition of the equipment.
  model?: string; // Optional model name or number.
  serialNumber?: string; // Optional serial number for tracking.
  manufactureDate?: Date; // Optional manufacture date.
  manufacturerWarranty?: { // Optional manufacturer warranty details.
    duration: number; // Duration of the warranty period.
    unit: 'days' | 'months' | 'years'; // Unit of time for the warranty duration.
  };
  insuranceId?: string; // Optional insurance ID associated with the equipment.

  // Metadata for tracking equipment creation and updates
  createdAt?: Date; // Optional creation timestamp.
  updatedAt?: Date; // Optional update timestamp.

  financingOptions: FinancingOption[]; // Available financing options for the equipment.
}

/**
 * Represents a structure that includes a public key associated with the equipment.
 * This can be used to identify and manage equipment on the blockchain.
 */
export interface EquipmentPublicKey {
    pubkey: PublicKey; // The public key representing the equipment, often used in blockchain interactions.
  }

/**
 * Represents the available financing options for equipment purchases.
 * Each option specifies the term length, interest rate, and minimum down payment required.
 */
export interface FinancingOption {
  term: number;
  termUnit: 'days' | 'weeks' | 'months';
  interestRate: number;
  minimumDownPayment: bigint;
}
  