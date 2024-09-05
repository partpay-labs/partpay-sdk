import { publicKey, Umi} from '@metaplex-foundation/umi';
import { extractEquipmentPubkeysFromResult } from '../helper/extractEquipmentPubkey';
import { getAllVendorEquipments } from '../instructions';

jest.mock('../src/helper/extractEquipmentPubkey');

describe('getAllVendorEquipments', () => {
  let mockUmi: jest.Mocked<Umi>;

  beforeEach(() => {
    mockUmi = {
      rpc: {
        sendTransaction: jest.fn().mockResolvedValue('transaction-signature'),
        confirmTransaction: jest.fn().mockResolvedValue({}),
      },
    } as any;
    (extractEquipmentPubkeysFromResult as jest.Mock).mockReturnValue([
      { pubkey: publicKey('11111111111111111111111111111111') },
      { pubkey: publicKey('22222222222222222222222222222222') },
    ]);
  });

  it('should fetch all vendor equipments successfully', async () => {
    const vendorPubkey = publicKey('33333333333333333333333333333333');

    const result = await getAllVendorEquipments(mockUmi, vendorPubkey);

    expect(mockUmi.rpc.sendTransaction).toHaveBeenCalled();
    expect(mockUmi.rpc.confirmTransaction).toHaveBeenCalled();
    expect(extractEquipmentPubkeysFromResult).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].pubkey).toEqual(publicKey('11111111111111111111111111111111'));
    expect(result[1].pubkey).toEqual(publicKey('22222222222222222222222222222222'));
  });
});