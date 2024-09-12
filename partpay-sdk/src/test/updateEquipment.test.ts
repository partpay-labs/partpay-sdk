import { publicKey, Umi } from '@metaplex-foundation/umi';
import { fetchAsset, update } from '@metaplex-foundation/mpl-core';
import { updateEquipment } from '../instructions/updateEquipment';

// Mock values for test
const validPublicKey = publicKey('CuieVDEDtLo7FypA9SbLM9saXFdb1dsshEkyErMqkRQq');
const mockNewUri = 'https://example.com/new-image.jpg';

// Mock the entire module at the top level
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

  it('should update equipment successfully', async () => {
    (fetchAsset as jest.Mock).mockResolvedValue({
      // Mock asset data structure as required
    });

    const result = await updateEquipment(mockUmi as Umi, {
      equipment: validPublicKey,
      newUri: mockNewUri,
    });

    expect(result).toBeDefined();
    expect(typeof result.add).toBe('function');

    expect(fetchAsset).toHaveBeenCalledWith(mockUmi, validPublicKey);
    expect(update).toHaveBeenCalledWith(mockUmi, {
      asset: expect.anything(),
      uri: mockNewUri,
    });

    // Check if the returned object has the expected structure
    expect(result).toEqual(expect.objectContaining({
      add: expect.any(Function),
    }));
  });

  it('should handle errors when the asset cannot be fetched', async () => {
    (fetchAsset as jest.Mock).mockRejectedValue(new Error('Failed to fetch asset'));

    await expect(updateEquipment(mockUmi as Umi, {
      equipment: validPublicKey,
      newUri: mockNewUri,
    })).rejects.toThrow('Failed to fetch asset');
  });
});