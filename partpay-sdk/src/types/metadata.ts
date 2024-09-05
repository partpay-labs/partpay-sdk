import { VendorMetadata } from "../types/Vendor";
import { EquipmentMetadata } from "./Equipment";

/**
 * Represents metadata that includes either vendor-specific or equipment-specific details.
 * This interface is used to encapsulate metadata for different types of entities within the SDK.
 */
export interface MetaData {
  metadata: VendorMetadata | EquipmentMetadata; // Metadata can be of type VendorMetadata or EquipmentMetadata, allowing for flexibility.
}
