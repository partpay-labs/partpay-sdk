import { Umi, TransactionBuilder, publicKey } from '@metaplex-foundation/umi';
import { update } from '@metaplex-foundation/mpl-core';
import { updateEquipment } from '../instructions';

jest.mock('@metaplex-foundation/mpl-core');

describe('updateEquipment', () => {
  let mockUmi: jest.Mocked<Umi>;

  beforeEach(() => {
    mockUmi = {} as any;
    (update as jest.Mock).mockReturnValue({
      add: jest.fn().mockReturnValue(new TransactionBuilder()),
    });
  });

  it('should update equipment successfully', async () => {
    const params = {
      equipment: publicKey('11111111111111111111111111111111'),
      newUri: 'https://example.com/new-metadata.json',
    };

    const result = await updateEquipment(mockUmi, params);

    expect(update).toHaveBeenCalledWith(mockUmi, expect.objectContaining({
      asset: params.equipment,
      uri: params.newUri,
    }));
    expect(result).toBeInstanceOf(TransactionBuilder);
  });
});