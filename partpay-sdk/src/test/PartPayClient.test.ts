import { keypairIdentity, publicKey, TransactionBuilder, Umi } from '@metaplex-foundation/umi';
import { PublicKey } from '@solana/web3.js';
import axios from 'axios';
import { createSigner } from '../helper/createSigner';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { partpayPlugin } from '../helper/partpayPlugin';
import { PartPayClient } from '../hooked';
import * as Instructions from '../instructions';
import { Vendor } from '../types/Vendor';
import { EquipmentMetadata, FinancingOption } from '../types/Equipment';
import { mplCore } from '@metaplex-foundation/mpl-core';

// Mock all external dependencies
jest.mock('@metaplex-foundation/umi', () => ({
  ...jest.requireActual('@metaplex-foundation/umi'),
  keypairIdentity: jest.fn(),
  publicKey: jest.fn((key) => key),
  generateSigner: jest.fn().mockReturnValue({
    publicKey: 'mockedPublicKey',
    signTransaction: jest.fn(),
    signAllTransactions: jest.fn(),
    signMessage: jest.fn(),
  }),
}));

jest.mock('@metaplex-foundation/umi-bundle-defaults', () => ({
  createUmi: jest.fn().mockReturnValue({
    use: jest.fn().mockReturnThis(),
    uploader: { upload: jest.fn().mockResolvedValue('https://example.com/mocked-uri') },
  }),
}));

jest.mock('@metaplex-foundation/mpl-core', () => ({
  mplCore: jest.fn().mockReturnValue({
    createCollection: jest.fn(),
    fetchCollection: jest.fn(),
    fetchAsset: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    burn: jest.fn(),
  }),

  createCollection: jest.fn().mockReturnValue({
    add: jest.fn().mockReturnThis(),
    setBlockhash: jest.fn().mockReturnThis(),
    build: jest.fn().mockResolvedValue({
      signatures: [new Uint8Array([1, 2, 3, 4])],
      message: {},
    }),
    sendAndConfirm: jest.fn().mockResolvedValue({
      signature: new Uint8Array([1, 2, 3, 4]),
      result: { value: { err: null } },
    }),
  }),
  fetchCollection: jest.fn().mockResolvedValue({
    publicKey: 'mocked-collection-public-key',
    oracles: [],
    lifecycleHooks: [],
  }),
  fetchAsset: jest.fn().mockResolvedValue({
    publicKey: 'mocked-asset-public-key',
    metadata: {
      name: 'Mocked Asset',
      uri: 'https://example.com/mocked-asset.json',
    },
  }),
  create: jest.fn().mockReturnValue({
    add: jest.fn().mockReturnThis(),
    setBlockhash: jest.fn().mockReturnThis(),
    build: jest.fn().mockResolvedValue({
      signatures: [new Uint8Array([1, 2, 3, 4])],
      message: {},
    }),
    sendAndConfirm: jest.fn().mockResolvedValue({
      signature: new Uint8Array([1, 2, 3, 4]),
      result: { value: { err: null } },
    }),
  }),
  update: jest.fn().mockReturnValue({
    add: jest.fn().mockReturnThis(),
    setBlockhash: jest.fn().mockReturnThis(),
    build: jest.fn().mockResolvedValue({
      signatures: [new Uint8Array([1, 2, 3, 4])],
      message: {},
    }),
    sendAndConfirm: jest.fn().mockResolvedValue({
      signature: new Uint8Array([1, 2, 3, 4]),
      result: { value: { err: null } },
    }),
  }),
  burn: jest.fn().mockReturnValue({
    add: jest.fn().mockReturnThis(),
    setBlockhash: jest.fn().mockReturnThis(),
    build: jest.fn().mockResolvedValue({
      signatures: [new Uint8Array([1, 2, 3, 4])],
      message: {},
    }),
    sendAndConfirm: jest.fn().mockResolvedValue({
      signature: new Uint8Array([1, 2, 3, 4]),
      result: { value: { err: null } },
    }),
  }),
}));

jest.mock('../helper/partpayPlugin', () => ({
  partpayPlugin: jest.fn(),
}));

jest.mock('../helper/createSigner', () => ({
  createSigner: jest.fn(),
}));

jest.mock('axios');

jest.mock('../instructions', () => ({
  ...jest.requireActual('../instructions'),
  createVendor: jest.fn().mockReturnValue({
    add: jest.fn().mockReturnThis(),
    setBlockhash: jest.fn().mockReturnThis(),
    build: jest.fn().mockResolvedValue({ signatures: [new Uint8Array([1, 2, 3, 4])], message: {} }),
    sendAndConfirm: jest.fn().mockResolvedValue({ signature: new Uint8Array([1, 2, 3, 4]), result: { value: { err: null } } }),
  }),
  addEquipment: jest.fn(),
  getEquipment: jest.fn().mockResolvedValue({}),
  getVendor: jest.fn().mockResolvedValue({}),
  getAllVendorEquipments: jest.fn().mockResolvedValue([]),
  updateEquipment: jest.fn().mockReturnValue({
    add: jest.fn().mockReturnThis(),
    setBlockhash: jest.fn().mockReturnThis(),
    build: jest.fn().mockResolvedValue({ signatures: [new Uint8Array([1, 2, 3, 4])], message: {} }),
    sendAndConfirm: jest.fn().mockResolvedValue({ signature: new Uint8Array([1, 2, 3, 4]), result: { value: { err: null } } }),
  }),
  deleteEquipment: jest.fn().mockReturnValue({
    add: jest.fn().mockReturnThis(),
    setBlockhash: jest.fn().mockReturnThis(),
    build: jest.fn().mockResolvedValue({ signatures: [new Uint8Array([1, 2, 3, 4])], message: {} }),
    sendAndConfirm: jest.fn().mockResolvedValue({ signature: new Uint8Array([1, 2, 3, 4]), result: { value: { err: null } } }),
  }),
  setFinancingOptions: jest.fn().mockReturnValue({
    add: jest.fn().mockReturnThis(),
    setBlockhash: jest.fn().mockReturnThis(),
    build: jest.fn().mockResolvedValue({ signatures: [new Uint8Array([1, 2, 3, 4])], message: {} }),
    sendAndConfirm: jest.fn().mockResolvedValue({ signature: new Uint8Array([1, 2, 3, 4]), result: { value: { err: null } } }),
  }),
  createInstallmentPlan: jest.fn().mockReturnValue({
    add: jest.fn().mockReturnThis(),
    setBlockhash: jest.fn().mockReturnThis(),
    build: jest.fn().mockResolvedValue({ signatures: [new Uint8Array([1, 2, 3, 4])], message: {} }),
    sendAndConfirm: jest.fn().mockResolvedValue({ signature: new Uint8Array([1, 2, 3, 4]), result: { value: { err: null } } }),
  }),
  findInstallmentPlanPDA: jest.fn().mockResolvedValue(['mockedPDA', 0]),
}));

expect.objectContaining({
  payer: expect.objectContaining({ publicKey: expect.any(String) }),
  identity: expect.objectContaining({ publicKey: expect.any(String) }),
  rpc: expect.any(Object),
  uploader: expect.any(Object),
  use: expect.any(Function),
});

describe('PartPayClient', () => {
  let client: PartPayClient;
  let mockUmi: jest.Mocked<Umi>;
  const validPublicKey = 'CuieVDEDtLo7FypA9SbLM9saXFdb1dsshEkyErMqkRQq';

  beforeEach(() => {
    mockUmi = {
      use: jest.fn().mockReturnThis(),
      payer: { publicKey: validPublicKey },
      identity: { publicKey: validPublicKey },
      rpc: {
        getAccount: jest.fn().mockResolvedValue({ exists: true, data: new Uint8Array([1, 2, 3, 4]) }),
        getLatestBlockhash: jest.fn().mockResolvedValue({ blockhash: 'mock-blockhash', lastValidBlockHeight: 1000 }),
        getBalance: jest.fn().mockResolvedValue({ basisPoints: BigInt(1000000) }),
      },
      uploader: {
        upload: jest.fn().mockResolvedValue('https://example.com/mocked-uri'),
        uploadJson: jest.fn().mockResolvedValue('https://example.com/mocked-json-uri')
      },
    } as unknown as jest.Mocked<Umi>;

    client = new PartPayClient({ umi: mockUmi });

    jest.clearAllMocks();
  });

  describe('createWithUmi', () => {
    it('should create a PartPayClient instance with Umi and signer', () => {
      const endpoint = 'https://api.devnet.solana.com';
      const secretKey = new Uint8Array(32).fill(1);

      const mockUmi = {
        use: jest.fn().mockReturnThis(),
      } as unknown as jest.Mocked<Umi>;

      (createUmi as jest.Mock).mockReturnValue(mockUmi);

      const mockSigner = {
        publicKey: 'mockedSignerPublicKey',
        signTransaction: jest.fn(),
        signAllTransactions: jest.fn(),
        signMessage: jest.fn(),
      };
      (createSigner as jest.Mock).mockReturnValue(mockSigner);

      const client = PartPayClient.createWithUmi(endpoint, secretKey);

      expect(createUmi).toHaveBeenCalledWith(endpoint);
      expect(mockUmi.use).toHaveBeenCalledWith(mplCore());
      expect(mockUmi.use).toHaveBeenCalledWith(partpayPlugin());
      expect(createSigner).toHaveBeenCalledWith(mockUmi, secretKey);
      expect(keypairIdentity).toHaveBeenCalledWith(mockSigner);
      expect(client).toBeInstanceOf(PartPayClient);
    });
  });

  it('should call createVendor instruction', async () => {
    const params = {
      owner: publicKey(validPublicKey),
      name: 'Test Vendor',
      metadata: {} as Vendor,
    };
    
    const createVendorMock = jest.fn().mockReturnValue({
      add: jest.fn().mockReturnThis(),
      setBlockhash: jest.fn().mockReturnThis(),
      build: jest.fn().mockResolvedValue({ signatures: [new Uint8Array([1, 2, 3, 4])], message: {} }),
      sendAndConfirm: jest.fn().mockResolvedValue({ signature: new Uint8Array([1, 2, 3, 4]), result: { value: { err: null } } }),
    });
    jest.spyOn(Instructions, 'createVendor').mockImplementation(createVendorMock);
  
    await client.createVendor(params);
  
    expect(createVendorMock).toHaveBeenCalledWith(expect.anything(), params);
  });

  it('should call addEquipment instruction', async () => {
    const params = {
      owner: publicKey(validPublicKey),
      vendor: publicKey(validPublicKey),
      name: 'Test Equipment',
      metadata: {} as EquipmentMetadata,
    };
    
    const addEquipmentMock = jest.fn().mockResolvedValue({
      // mock the expected return value
    });
    jest.spyOn(Instructions, 'addEquipment').mockImplementation(addEquipmentMock);
  
    await client.addEquipment(params);
  
    console.log('addEquipment mock calls:', addEquipmentMock.mock.calls);
  
    expect(addEquipmentMock).toHaveBeenCalledWith(expect.anything(), params);
  });

  it('should call getEquipment instruction', async () => {
    const equipmentPubkey = publicKey(validPublicKey);
    const getEquipmentMock = jest.fn().mockResolvedValue({});
    jest.spyOn(Instructions, 'getEquipment').mockImplementation(getEquipmentMock);
  
    await client.getEquipment(equipmentPubkey);
  
    expect(getEquipmentMock).toHaveBeenCalledWith(mockUmi, equipmentPubkey);
  });

  describe('getVendor', () => {
    it('should call getVendor instruction', async () => {
      const vendorPubkey = publicKey(validPublicKey);
      await client.getVendor(vendorPubkey);
      expect(Instructions.getVendor).toHaveBeenCalledWith(mockUmi, vendorPubkey);
    });
  });

  describe('getAllVendorEquipments', () => {
    it('should call getAllVendorEquipments instruction', async () => {
      const vendorPubkey = publicKey(validPublicKey);
      await client.getAllVendorEquipments(vendorPubkey);
      expect(Instructions.getAllVendorEquipments).toHaveBeenCalledWith(mockUmi, vendorPubkey);
    });
  });

  it('should call updateEquipment instruction', async () => {
    const params = {
      equipment: publicKey(validPublicKey),
      newUri: 'https://example.com/new-metadata.json',
    };
    const updateEquipmentMock = jest.fn().mockReturnValue({
      add: jest.fn().mockReturnThis(),
      setBlockhash: jest.fn().mockReturnThis(),
      build: jest.fn().mockResolvedValue({ signatures: [new Uint8Array([1, 2, 3, 4])], message: {} }),
      sendAndConfirm: jest.fn().mockResolvedValue({ signature: new Uint8Array([1, 2, 3, 4]), result: { value: { err: null } } }),
    });
    jest.spyOn(Instructions, 'updateEquipment').mockImplementation(updateEquipmentMock);
  
    await client.updateEquipment(params);
  
    expect(updateEquipmentMock).toHaveBeenCalledWith(expect.anything(), params);
  });

  describe('deleteEquipment', () => {
    it('should call deleteEquipment instruction', async () => {
      const params = {
        owner: publicKey(validPublicKey),
        vendor: publicKey(validPublicKey),
        equipment: publicKey(validPublicKey),
      };
      await client.deleteEquipment(params);
      expect(Instructions.deleteEquipment).toHaveBeenCalledWith(mockUmi, params);
    });
  });

  describe('setFinancingOptions', () => {
    it('should call setFinancingOptions instruction', async () => {
      const params = {
        equipment: publicKey(validPublicKey),
        options: [] as FinancingOption[],
      };
      await client.setFinancingOptions(params);
      expect(Instructions.setFinancingOptions).toHaveBeenCalledWith(mockUmi, params);
    });
  });

  describe('createInstallmentPlan', () => {
    it('should call createInstallmentPlan instruction', async () => {

      const params = {
        borrower: publicKey('CuieVDEDtLo7FypA9SbLM9saXFdb1dsshEkyErMqkRQq'), // Converting to the correct type
        equipment: publicKey('CuieVDEDtLo7FypA9SbLM9saXFdb1dsshEkyErMqkRQq'), // Converting to the correct type
        firstPaymentDate: new Date(2023, 0, 1),
        installmentCount: 12,
        interestRate: 5,
        termUnit: 'months' as 'months' | 'days' | 'weeks', // Explicitly typing termUnit
        totalAmount: 1000,
      };

      await client.createInstallmentPlan(params)

      const expectedParams = {
        ...params,
        firstPaymentDate: BigInt(new Date(2023, 0, 1).getTime() / 1000),
      };

      expect(Instructions.createInstallmentPlan).toHaveBeenCalledWith(mockUmi, expectedParams);
    });
  });

  describe('getPaymentAction', () => {
    it('should fetch payment action data', async () => {
      const pubkey = 'test-pubkey';
      const mockResponse = { data: 'mock-data' };
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await client.getPaymentAction(pubkey);

      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(pubkey));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createFullPaymentTransaction', () => {
    it('should create a full payment transaction', async () => {
      const pubkey = 'test-pubkey';
      const account = 'test-account';
      const mockResponse = { data: 'mock-data' };
      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await client.createFullPaymentTransaction(pubkey, account);

      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining(pubkey), { account });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('checkExistingInstallmentPlan', () => {
    it('should return true if installment plan exists', async () => {
      const equipmentPubkey = new PublicKey(validPublicKey);
      const borrowerPubkey = new PublicKey(validPublicKey);
      const result = await client.checkExistingInstallmentPlan(equipmentPubkey, borrowerPubkey);
      expect(result).toBe(true);
    });

    it('should return false if installment plan does not exist', async () => {
      const equipmentPubkey = new PublicKey(validPublicKey);
      const borrowerPubkey = new PublicKey(validPublicKey);
      (mockUmi.rpc.getAccount as jest.Mock).mockRejectedValueOnce(new Error('Account not found'));
      const result = await client.checkExistingInstallmentPlan(equipmentPubkey, borrowerPubkey);
      expect(result).toBe(false);
    });
  });

  describe('sendAndConfirmTransaction', () => {
    it('should send and confirm a transaction', async () => {
      const mockTransaction = {
        sendAndConfirm: jest.fn().mockResolvedValue({ signature: new Uint8Array([1, 2, 3, 4]) }),
      } as unknown as TransactionBuilder;

      const signature = await client.sendAndConfirmTransaction(mockTransaction);

      expect(mockTransaction.sendAndConfirm).toHaveBeenCalledWith(mockUmi);
      expect(signature).toBe('2VfUX');
    });
  });
});