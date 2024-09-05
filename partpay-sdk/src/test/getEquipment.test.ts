import { publicKey, Umi } from '@metaplex-foundation/umi';
import { getEquipment } from '../instructions';

describe('getEquipment', () => {
  let mockUmi: Partial<Umi>;
  let mockGetAccount: jest.Mock;

  beforeEach(() => {
    mockGetAccount = jest.fn();
    mockUmi = {
        rpc: {
            getAccount: mockGetAccount,
        },
    } as unknown as Partial<Umi>;
  });

  it('should fetch equipment successfully', async () => {
    const equipmentPubkey = publicKey('11111111111111111111111111111111');
    mockGetAccount.mockResolvedValue({
      exists: true,
      data: new Uint8Array([/* mocked account data */]),
    });

    const result = await getEquipment(mockUmi as Umi, equipmentPubkey);

    expect(mockGetAccount).toHaveBeenCalledWith(equipmentPubkey);
    expect(result).toBeDefined();
    // Add more specific assertions based on your EquipmentMetadata structure
  });

  it('should throw an error if equipment does not exist', async () => {
    const equipmentPubkey = publicKey('22222222222222222222222222222222');
    mockGetAccount.mockResolvedValue({ exists: false });

    await expect(getEquipment(mockUmi as Umi, equipmentPubkey)).rejects.toThrow('Equipment account does not exist');
  });
});