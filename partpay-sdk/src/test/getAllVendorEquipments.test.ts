import { publicKey, Umi, TransactionBuilder } from '@metaplex-foundation/umi';
import { extractEquipmentPubkeysFromResult } from '../helper/extractEquipmentPubkey';
import { getAllVendorEquipments } from '../instructions';

jest.mock('../helper/extractEquipmentPubkey');

describe('getAllVendorEquipments', () => {
  let mockUmi: jest.Mocked<Umi>;

  beforeEach(() => {
    mockUmi = {
      payer: { publicKey: publicKey('EXqHwSuLAK56rDAXFaHbCo22zCLq7DsTCTJRxn4u3WWX') },
    } as unknown as jest.Mocked<Umi>;

    // Mock TransactionBuilder's sendAndConfirm method
    TransactionBuilder.prototype.sendAndConfirm = jest.fn().mockResolvedValue('mocked-transaction-result');

    (extractEquipmentPubkeysFromResult as jest.Mock).mockReturnValue([
      { pubkey: publicKey('6PvitNJX5DWq3zAZ5UkudapLHoG5mzqvB5kLwGXWz2mD') },
      { pubkey: publicKey('8nfMfBPHWZWqQyjGvwAdZxqRccQDGFZfk1VvzC1voZGv') },
    ]);
  });

  it('should fetch all vendor equipments successfully', async () => {
    const vendorPubkey = publicKey('EXqHwSuLAK56rDAXFaHbCo22zCLq7DsTCTJRxn4u3WWX');

    const result = await getAllVendorEquipments(mockUmi, vendorPubkey);

    expect(TransactionBuilder.prototype.sendAndConfirm).toHaveBeenCalled();
    expect(extractEquipmentPubkeysFromResult).toHaveBeenCalledWith('mocked-transaction-result');
    expect(result).toHaveLength(2);
    expect(result[0].pubkey).toEqual(publicKey('6PvitNJX5DWq3zAZ5UkudapLHoG5mzqvB5kLwGXWz2mD'));
    expect(result[1].pubkey).toEqual(publicKey('8nfMfBPHWZWqQyjGvwAdZxqRccQDGFZfk1VvzC1voZGv'));
  });
});