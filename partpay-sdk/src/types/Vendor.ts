import { PublicKey } from "@metaplex-foundation/umi";

/**
 * Represents a vendor, including its owner, name, and metadata.
 */
export interface Vendor {
  owner: PublicKey; // PublicKey of the vendor owner
  name: string;     // Name of the vendor
  image?: string; // Optional URL of the vendor's image
  metadata: VendorMetadata; // Metadata containing details about the vendor
}

/**
 * Represents the data required to update a vendor.
 * The structure mirrors the Vendor interface for ease of updates.
 */
export interface VendorUpdate {
  owner: PublicKey; // PublicKey of the vendor owner
  name: string;     // Updated name of the vendor
  metadata: VendorMetadata; // Updated metadata about the vendor
}

/**
 * Metadata describing a vendor's details.
 */
export interface VendorMetadata {
  shopName: string; // Name of the shop
  description?: string; // Optional description of the vendor
  location?: Location;  // Optional location details
  status: VendorStatus; // Current status of the vendor
  businessType?: string; // Optional type of business (e.g., retail, services)
  socialMedia?: SocialMediaLinks; // Optional links to social media profiles
  operatingHours?: OperatingHours; // Optional operating hours of the vendor
}

/**
 * Represents a physical location with detailed address information.
 */
export interface Location {
  address: string; // Street address of the vendor
  city: string;    // City where the vendor is located
  state?: string;  // Optional state or region
  country: string; // Country where the vendor operates
  postalCode?: string; // Optional postal or ZIP code
  coordinates?: {       // Optional geographical coordinates
    latitude: number;
    longitude: number;
  };
}

/**
 * Enum representing the possible statuses of a vendor.
 */
export enum VendorStatus {
  Active = 'active',     // Vendor is actively operating
  Inactive = 'inactive', // Vendor is temporarily not operating
  Pending = 'pending'    // Vendor is pending approval or setup
}

/**
 * Represents social media links associated with the vendor.
 * Keys represent the platform, and values are the respective profile URLs.
 */
export interface SocialMediaLinks {
  facebook?: string;  // Optional Facebook URL
  twitter?: string;   // Optional Twitter URL
  instagram?: string; // Optional Instagram URL
  linkedin?: string;  // Optional LinkedIn URL
  [key: string]: string | undefined; // Allow additional platforms with URL strings
}

/**
 * Represents the operating hours of a vendor for each day of the week.
 */
export interface OperatingHours {
  monday?: DayHours;    // Operating hours for Monday
  tuesday?: DayHours;   // Operating hours for Tuesday
  wednesday?: DayHours; // Operating hours for Wednesday
  thursday?: DayHours;  // Operating hours for Thursday
  friday?: DayHours;    // Operating hours for Friday
  saturday?: DayHours;  // Operating hours for Saturday
  sunday?: DayHours;    // Operating hours for Sunday
}

/**
 * Represents the opening and closing hours for a specific day.
 */
export interface DayHours {
  open: string;  // Opening time in HH:mm format
  close: string; // Closing time in HH:mm format
}
