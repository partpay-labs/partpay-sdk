import {
  publicKey,
  PublicKey as UmiPublicKey,
  TransactionBuilder,
  TransactionSignature,
  Umi,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { partpayPlugin } from "../helper/partpayPlugin";
import { createVendor } from "../instructions/createVendor";
import { EquipmentMetadata, EquipmentPublicKey, FinancingOption } from "../types/Equipment";
import { addEquipment } from "../instructions/addEquipment";
import { getEquipment } from "../instructions/getEquipment";
import { getVendor } from "../instructions/getVendor";
import { getAllVendorEquipments } from "../instructions/getAllVendorEquipent";
import { updateEquipment } from "../instructions/updateEquipment";
import { deleteEquipment } from "../instructions/deleteEquipment";
import { setFinancingOptions } from "../instructions/setFinancingOptions";
import { createInstallmentPlan } from "../instructions/createInstallmentPlan";
import { Vendor, VendorData } from "../types/Vendor";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { findInstallmentPlanPDA } from "../instructions/getInstalment";
import { Connection, PublicKey as SolanaPublicKey } from "@solana/web3.js";
import { ActionGetResponse, ActionPostResponse } from "@solana/actions";
import axios from "axios";
import { createSigner } from "../helper/createSigner";

/**
 * PartPayClient is the main SDK class for interacting with the PartPay protocol.
 * It provides various methods for managing vendors, equipment, and financing options on the Solana blockchain.
 */
export class PartPayClient {
  private umi?: Umi;
  private connection?: Connection;
  private readonly baseUrl: string = 'https://api.partpay.xyz';

  constructor(options: { umi?: Umi; connection?: Connection; }) {
    this.umi = options.umi;
    this.connection = options.connection;
  }
  /**
   * Factory method to create a new PartPayClient instance with Umi.
   * 
   * @param endpoint - The Solana RPC endpoint to connect to.
   * @returns A new instance of PartPayClient.
   */
  static createWithUmi(endpoint: string, secretKey: Uint8Array): PartPayClient {
    const umi = createUmi(endpoint)
      .use(mplCore())
      .use(partpayPlugin())

    const signer = createSigner(umi, secretKey);
    umi.use(keypairIdentity(signer));
    return new PartPayClient({ umi });
  }

  /**
   * Factory method to create a new PartPayClient instance with a Solana Connection.
   * 
   * @param endpoint - The Solana RPC endpoint to connect to.
   * @returns A new instance of PartPayClient.
   */
  static createWithConnection(endpoint: string): PartPayClient {
    const connection = new Connection(endpoint);
    return new PartPayClient({ connection });
  }

  async getAccountInfo(pubkey: SolanaPublicKey | UmiPublicKey): Promise<any> {
    if (this.umi) {
      try {
        return await this.umi.rpc.getAccount(pubkey as UmiPublicKey);
      } catch (error) {
        console.error("Error fetching account with Umi:", error);
        throw error;
      }
    } else if (this.connection) {
      try {
        return await this.connection.getAccountInfo(pubkey as SolanaPublicKey);
      } catch (error) {
        console.error("Error fetching account with Solana Connection:", error);
        throw error;
      }
    } else {
      throw new Error("No connection available. Initialize with either Umi or Solana Connection.");
    }
  }
  /**
   * Creates a new vendor on the blockchain.
   * 
   * @param params - An object containing the vendor owner's public key, vendor name, and metadata.
   * @returns A TransactionBuilder object to build and send the transaction.
   */
  async createVendor( metadata: Vendor ): Promise<TransactionBuilder> {
    if (!this.umi) {
      throw new Error("Umi instance is not initialized. Please initialize with Umi to use this method.");
    }
    return createVendor(this.umi, metadata);
  }

  /**
   * Adds a new piece of equipment to a vendor's inventory.
   * 
   * @param params - An object containing the equipment owner's public key, vendor's public key, equipment name, and metadata.
   * @returns A TransactionBuilder object to build and send the transaction.
   */
  async addEquipment(params: { owner: UmiPublicKey; vendor: UmiPublicKey; name: string; metadata: EquipmentMetadata }): Promise<TransactionBuilder> {
    if (!this.umi) {
      throw new Error("Umi instance is not initialized. Please initialize with Umi to use this method.");
    }
    return addEquipment(this.umi, params);
  }

  /**
   * Retrieves the metadata of a specific piece of equipment.
   * 
   * @param equipmentPubkey - The public key of the equipment.
   * @returns The metadata associated with the equipment.
   */
  async getEquipment(equipmentPubkey: UmiPublicKey): Promise<EquipmentMetadata> {
    if (!this.umi) {
      throw new Error("Umi instance is not initialized. Please initialize with Umi to use this method.");
    }
    return getEquipment(this.umi, equipmentPubkey);
  }

  /**
   * Retrieves data about a specific vendor.
   * 
   * @param vendorPubkey - The public key of the vendor.
   * @returns An object containing the vendor's data.
   */
  async getVendor(vendorPubkey: UmiPublicKey): Promise<VendorData> {
    if (!this.umi) {
      throw new Error("Umi instance is not initialized. Please initialize with Umi to use this method.");
    }
    return getVendor(this.umi, vendorPubkey);
  }

  /**
   * Retrieves all equipment associated with a specific vendor.
   * 
   * @param vendorPubkey - The public key of the vendor.
   * @returns An array of public keys for each piece of equipment.
   */
  async getAllVendorEquipments(vendorPubkey: UmiPublicKey): Promise<EquipmentPublicKey[]> {
    if (!this.umi) {
      throw new Error("Umi instance is not initialized. Please initialize with Umi to use this method.");
    }
    return getAllVendorEquipments(this.umi, vendorPubkey);
  }

  /**
   * Updates the metadata URI of a specific piece of equipment.
   * 
   * @param params - An object containing the equipment's public key and the new URI.
   * @returns A TransactionBuilder object to build and send the transaction.
   */
  async updateEquipment(params: { equipmentPubKey: UmiPublicKey; metadata: EquipmentMetadata; }): Promise<TransactionBuilder> {
    if (!this.umi) {
      throw new Error("Umi instance is not initialized. Please initialize with Umi to use this method.");
    }
    return updateEquipment(this.umi, params);
  }

  /**
   * Deletes a specific piece of equipment from a vendor's inventory.
   * 
   * @param params - An object containing the owner's, vendor's, and equipment's public keys.
   * @returns A TransactionBuilder object to build and send the transaction.
   */
  async deleteEquipment(params: { owner: UmiPublicKey; vendor: UmiPublicKey; equipment: UmiPublicKey }): Promise<TransactionBuilder> {
    if (!this.umi) {
      throw new Error("Umi instance is not initialized. Please initialize with Umi to use this method.");
    }
    return deleteEquipment(this.umi, params);
  }

  /**
   * Sets financing options for a specific piece of equipment.
   * 
   * @param params - An object containing the equipment's public key and an array of financing options.
   * @returns A TransactionBuilder object to build and send the transaction.
   */
  async setFinancingOptions(params: { equipment: UmiPublicKey; options: FinancingOption[] }): Promise<TransactionBuilder> {
    if (!this.umi) {
      throw new Error("Umi instance is not initialized. Please initialize with Umi to use this method.");
    }
    return setFinancingOptions(this.umi, params);
  }

  /**
 * Creates an installment plan for financing equipment purchases.
 *
 * @param params - An object containing the equipment's public key, borrower's public key,
 * total amount, installment count, interest rate, and the first payment date.
 * @returns A TransactionBuilder object to build and send the transaction.
 */
  async createInstallmentPlan(
    params: {
      equipment: UmiPublicKey;
      borrower: UmiPublicKey;
      totalAmount: number;
      installmentCount: number;
      interestRate: number;
      firstPaymentDate: Date;
      termUnit: 'days' | 'weeks' | 'months';
    }
  ): Promise<TransactionBuilder> {
    if (!this.umi) {
      throw new Error("Umi instance is not initialized. Please initialize with Umi to use this method.");
    }

    // Assuming you have a `createInstallmentPlan` function that uses `umi` to build the transaction
    return createInstallmentPlan(this.umi, params);
  }

  async getPaymentAction(pubkey: string): Promise<ActionGetResponse> {
    const response = await axios.get(`${this.baseUrl}/pay/action/${pubkey}`);
    return response.data;
  }

  async createFullPaymentTransaction(pubkey: string, account: string): Promise<ActionPostResponse> {
    const response = await axios.post(`${this.baseUrl}/pay/action/${pubkey}/full`, { account });
    return response.data;
  }

  async createTransactionInstallment(pubkey: string, account: string, installmentPlan: number): Promise<ActionPostResponse> {
    const response = await axios.post(`${this.baseUrl}/pay/action/${pubkey}/installments`, {
      account,
      installmentPlan
    });
    return response.data;
  }

  /**
   * Creates and serializes an installment plan transaction.
   *
   * @param equipmentPubkey - The public key of the equipment.
   * @param accountPubkey - The public key of the account (borrower).
   * @param financingOption - The financing option details.
   * @returns A Buffer containing the serialized transaction.
   */
  async createInstallmentPlanTransaction(
    equipmentPubkey: UmiPublicKey,
    accountPubkey: UmiPublicKey,
    financingOption: FinancingOption
  ): Promise<Buffer> {
    if (!this.umi) {
      throw new Error("Umi instance is not initialized. Please initialize with Umi to use this method.");
    }

    const equipment = await this.getEquipment(equipmentPubkey);
    const firstPaymentDate = this.calculateFirstPaymentDate(financingOption);

    const transactionBuilder = await this.createInstallmentPlan({
      equipment: equipmentPubkey,
      borrower: accountPubkey,
      totalAmount: equipment.price,
      installmentCount: financingOption.term,
      interestRate: financingOption.interestRate,
      firstPaymentDate,
      termUnit: financingOption.termUnit,
    });

    try {
      // Build and sign the transaction
      const transaction = await transactionBuilder.build(this.umi);

      // Serialize the transaction signature
      const serializedTransaction = this.convertSignatureToString(transaction.signatures[0]);

      return Buffer.from(serializedTransaction);
    } catch (error) {
      console.error("An error occurred while creating or serializing the transaction:", error);
      throw error;
    }
  }

  /**
 * Checks if an existing installment plan exists on the blockchain.
 *
 * @param equipmentPubkey - The public key of the equipment.
 * @param borrowerPubkey - The public key of the borrower.
 * @returns A boolean indicating whether the installment plan exists.
 */
  async checkExistingInstallmentPlan(
    equipmentPubkey: SolanaPublicKey,
    borrowerPubkey: SolanaPublicKey
  ): Promise<boolean> {
    if (!this.umi) {
      throw new Error("Umi instance is not initialized. Please initialize with Umi to use this method.");
    }

    const [installmentPlanPDA] = await findInstallmentPlanPDA(equipmentPubkey, borrowerPubkey);

    try {
      // Attempt to get the account information using the Umi instance
      await this.umi.rpc.getAccount(publicKey(installmentPlanPDA));
      return true;
    } catch (error) {
      // Check if the error indicates the account was not found
      if (error instanceof Error && error.message.includes("Account not found")) {
        return false;
      }
      throw error;
    }
  }

  private calculateFirstPaymentDate(financingOption: FinancingOption): Date {
    const now = new Date();
    switch (financingOption.termUnit) {
      case 'days':
        return new Date(now.setDate(now.getDate() + financingOption.term));
      case 'weeks':
        return new Date(now.setDate(now.getDate() + financingOption.term * 7));
      case 'months':
        return new Date(now.setMonth(now.getMonth() + financingOption.term));
      default:
        throw new Error('Invalid term unit');
    }
  }

  async sendAndConfirmTransaction(transaction: TransactionBuilder): Promise<string> {
    if (!this.umi) {
      throw new Error("Umi instance is not initialized. Please initialize with Umi to use this method.");
    }
    const result = await transaction.sendAndConfirm(this.umi);
    return this.convertSignatureToString(result.signature);
  }

  /**
   * Converts a Uint8Array signature to a base58-encoded string.
   * 
   * @param signature - The transaction signature as a Uint8Array.
   * @returns The base58-encoded signature string.
   */
  convertSignatureToString(signature: TransactionSignature): string {
    return base58.deserialize(signature)[0];
  }
}
