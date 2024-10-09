import { Vendor, VendorMetadata } from "../types/Vendor";
import { EquipmentMetadata } from "./Equipment";
import { Marketplace } from "./market";

/**
 * Represents metadata that includes either vendor-specific or equipment-specific details.
 * This interface is used to encapsulate metadata for different types of entities within the SDK.
 */
export interface MetaData {
  metadata: Vendor | EquipmentMetadata | Marketplace | EquipmentMetadata; // Metadata can be of type VendorMetadata or EquipmentMetadata, allowing for flexibility.
}
