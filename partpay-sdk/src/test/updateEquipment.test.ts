import { publicKey, Umi } from '@metaplex-foundation/umi';
import { fetchAsset, update } from '@metaplex-foundation/mpl-core';
import { updateEquipment } from '../instructions/updateEquipment';
import { EquipmentMetadata } from '../types/Equipment';

// Mock values for test
const validPublicKey = publicKey('CuieVDEDtLo7FypA9SbLM9saXFdb1dsshEkyErMqkRQq');
const mockNewUri = 'https://example.com/new-image.jpg';

jest.mock('@metaplex-foundation/mpl-core', () => ({
  fetchAsset: jest.fn(),
  update: jest.fn().mockReturnValue({
    add: jest.fn().mockReturnThis(),
  }),
}));

describe('updateEquipment', () => {
  let mockUmi: Partial<Umi>;

  beforeEach(() => {
    mockUmi = {
      payer: {
        publicKey: validPublicKey,
      },
    } as Partial<Umi>;
  });

  const createMockMetadata = (): EquipmentMetadata => ({
    name: 'Test Equipment',
    description: 'This is a test equipment',
    owner: validPublicKey,
    vendorId: validPublicKey,
    image: "",
    images: [""],
    financingOptions: [],
    isActive: true,
    category: 'TestCategory',
    model: 'TestModel',
    serialNumber: 'TestSerialNumber',
    walletAddress: validPublicKey, // Add this
    price: 1000, // Add this (as a string or number, depending on your type)
    currency: 'USD', // Add this
    stockQuantity: 10, // Add this
    // If there are any other required fields, add them here
  });

  it('should update equipment successfully', async () => {
    (fetchAsset as jest.Mock).mockResolvedValue({
      // Mock asset data structure as required
    });
  
    const mockMetadata = createMockMetadata();

    const params = {
      equipmentPubKey: validPublicKey,
      metadata: mockMetadata,
    };
  
    const result = await updateEquipment(mockUmi as Umi, params);
  
    expect(result).toBeDefined();
    expect(typeof result.add).toBe('function');
  
    expect(fetchAsset).toHaveBeenCalledWith(mockUmi, validPublicKey);
    expect(update).toHaveBeenCalledWith(mockUmi, {
      asset: expect.anything(),
      // Add other expected parameters here if needed
    });
  
    expect(result).toEqual(expect.objectContaining({
      add: expect.any(Function),
    }));
  });

  it('should handle errors when the asset cannot be fetched', async () => {
    (fetchAsset as jest.Mock).mockRejectedValue(new Error('Failed to fetch asset'));

    const mockMetadata = createMockMetadata();

    await expect(updateEquipment(mockUmi as Umi, {
      equipmentPubKey: validPublicKey,
      metadata: mockMetadata,
    })).rejects.toThrow('Failed to fetch asset');
  });
});