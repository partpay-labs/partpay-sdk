import { Umi, TransactionBuilder, generateSigner, publicKey } from '@metaplex-foundation/umi';
import { create, fetchCollection } from '@metaplex-foundation/mpl-core';import { metadataUploader } from '../helper/metadataUploader';
import { EquipmentMetadata } from '../types';
import { addEquipment } from '../instructions';
;

jest.mock('@metaplex-foundation/mpl-core');
jest.mock('../src/helper/metadataUploader');

describe('addEquipment', () => {
  let mockUmi: jest.Mocked<Umi>;

  beforeEach(() => {
    mockUmi = {
      payer: { publicKey: publicKey('11111111111111111111111111111111') },
    } as any;
    (create as jest.Mock).mockReturnValue({
      add: jest.fn().mockReturnValue(new TransactionBuilder()),
    });
    (fetchCollection as jest.Mock).mockResolvedValue({
      publicKey: publicKey('22222222222222222222222222222222'),
      oracles: [],
      lifecycleHooks: [],
    });
    (metadataUploader as jest.Mock).mockResolvedValue('https://example.com/metadata.json');
    (generateSigner as jest.Mock).mockReturnValue({
      publicKey: publicKey('33333333333333333333333333333333'),
    });
  });

  it('should add equipment successfully', async () => {
    const params = {
      owner: publicKey('44444444444444444444444444444444'),
      vendor: publicKey('55555555555555555555555555555555'),
      name: 'Test Equipment',
      metadata: {} as EquipmentMetadata,
    };

    const result = await addEquipment(mockUmi, params);

    expect(metadataUploader).toHaveBeenCalledWith(mockUmi, params.metadata);
    expect(fetchCollection).toHaveBeenCalledWith(mockUmi, params.vendor);
    expect(create).toHaveBeenCalledWith(mockUmi, expect.objectContaining({
      name: params.name,
      uri: 'https://example.com/metadata.json',
    }));
    expect(result).toBeInstanceOf(TransactionBuilder);
  });
});