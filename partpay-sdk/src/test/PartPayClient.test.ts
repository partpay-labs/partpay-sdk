
import { publicKey, TransactionBuilder, Umi } from '@metaplex-foundation/umi';
import * as Instructions from '../instructions';
import { EquipmentMetadata, FinancingOption } from '../types/Equipment';
import { Vendor } from '../types/Vendor';
import { PartPayClient } from '../hooked/partPayClient';

// Mock the instructions
jest.mock('../src/instructions');

describe('PartPayClient', () => {
  let client: PartPayClient;
  let mockUmi: jest.Mocked<Umi>;

  beforeEach(() => {
    mockUmi = {
      payer: { publicKey: publicKey('11111111111111111111111111111111') },
    } as any;
    client = new PartPayClient(mockUmi);
  });

  describe('create', () => {
    it('should create a new PartPayClient instance', () => {
      const newClient = PartPayClient.create('https://api.devnet.solana.com');
      expect(newClient).toBeInstanceOf(PartPayClient);
    });
  });

  describe('createVendor', () => {
    it('should call createVendor instruction', async () => {
      const params = {
        owner: publicKey('11111111111111111111111111111111'),
        name: 'Test Vendor',
        metadata: {} as Vendor,
      };
      await client.createVendor(params);
      expect(Instructions.createVendor).toHaveBeenCalledWith(mockUmi, params);
    });
  });

  describe('addEquipment', () => {
    it('should call addEquipment instruction', async () => {
      const params = {
        owner: publicKey('11111111111111111111111111111111'),
        vendor: publicKey('22222222222222222222222222222222'),
        name: 'Test Equipment',
        metadata: {} as EquipmentMetadata,
      };
      await client.addEquipment(params);
      expect(Instructions.addEquipment).toHaveBeenCalledWith(mockUmi, params);
    });
  });

  describe('getEquipment', () => {
    it('should call getEquipment instruction', async () => {
      const equipmentPubkey = publicKey('33333333333333333333333333333333');
      await client.getEquipment(equipmentPubkey);
      expect(Instructions.getEquipment).toHaveBeenCalledWith(mockUmi, equipmentPubkey);
    });
  });

  describe('getVendor', () => {
    it('should call getVendor instruction', async () => {
      const vendorPubkey = publicKey('44444444444444444444444444444444');
      await client.getVendor(vendorPubkey);
      expect(Instructions.getVendor).toHaveBeenCalledWith(mockUmi, vendorPubkey);
    });
  });

  describe('getAllVendorEquipments', () => {
    it('should call getAllVendorEquipments instruction', async () => {
      const vendorPubkey = publicKey('55555555555555555555555555555555');
      await client.getAllVendorEquipments(vendorPubkey);
      expect(Instructions.getAllVendorEquipments).toHaveBeenCalledWith(mockUmi, vendorPubkey);
    });
  });

  describe('updateEquipment', () => {
    it('should call updateEquipment instruction', async () => {
      const params = {
        equipment: publicKey('66666666666666666666666666666666'),
        newUri: 'https://example.com/new-metadata.json',
      };
      await client.updateEquipment(params);
      expect(Instructions.updateEquipment).toHaveBeenCalledWith(mockUmi, params);
    });
  });

  describe('deleteEquipment', () => {
    it('should call deleteEquipment instruction', async () => {
      const params = {
        owner: publicKey('77777777777777777777777777777777'),
        vendor: publicKey('88888888888888888888888888888888'),
        equipment: publicKey('99999999999999999999999999999999'),
      };
      await client.deleteEquipment(params);
      expect(Instructions.deleteEquipment).toHaveBeenCalledWith(mockUmi, params);
    });
  });

  describe('setFinancingOptions', () => {
    it('should call setFinancingOptions instruction', async () => {
      const params = {
        equipment: publicKey('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
        options: [] as FinancingOption[],
      };
      await client.setFinancingOptions(params);
      expect(Instructions.setFinancingOptions).toHaveBeenCalledWith(mockUmi, params);
    });
  });

  describe('createInstallmentPlan', () => {
    it('should call createInstallmentPlan instruction', async () => {
      const params = {
        equipment: publicKey('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
        borrower: publicKey('cccccccccccccccccccccccccccccccc'),
        totalAmount: 1000,
        installmentCount: 12,
        interestRate: 5,
        firstPaymentDate: new Date(),
      };
      await client.createInstallmentPlan(params);
      expect(Instructions.createInstallmentPlan).toHaveBeenCalledWith(mockUmi, params);
    });
  });

  describe('sendAndConfirmTransaction', () => {
    it('should send and confirm a transaction', async () => {
      const mockTransaction = {
        sendAndConfirm: jest.fn().mockResolvedValue({ signature: 'mocked-signature' }),
      } as unknown as TransactionBuilder;

      const signature = await client.sendAndConfirmTransaction(mockTransaction);

      expect(mockTransaction.sendAndConfirm).toHaveBeenCalledWith(mockUmi);
      expect(signature).toBe('mocked-signature');
    });
  });
});