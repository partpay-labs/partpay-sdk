import { Umi, TransactionBuilder, generateSigner, publicKey } from '@metaplex-foundation/umi';
import { createCollection } from '@metaplex-foundation/mpl-core';
import { Vendor } from '../types';
import { metadataUploader } from '../helper/metadataUploader';
import { createVendor } from '../instructions';

jest.mock('@metaplex-foundation/mpl-core');
jest.mock('../src/helper/metadataUploader');

describe('createVendor', () => {
  let mockUmi: jest.Mocked<Umi>;

  beforeEach(() => {
    mockUmi = {
      payer: { publicKey: publicKey('11111111111111111111111111111111') },
    } as any;
    (createCollection as jest.Mock).mockReturnValue({
      add: jest.fn().mockReturnValue(new TransactionBuilder()),
    });
    (metadataUploader as jest.Mock).mockResolvedValue('https://example.com/metadata.json');
    (generateSigner as jest.Mock).mockReturnValue({
      publicKey: publicKey('22222222222222222222222222222222'),
    });
  });

  it('should create a vendor successfully', async () => {
    const params = {
      owner: publicKey('33333333333333333333333333333333'),
      name: 'Test Vendor',
      metadata: {} as Vendor,
    };

    const result = await createVendor(mockUmi, params);

    expect(metadataUploader).toHaveBeenCalledWith(mockUmi, params.metadata);
    expect(createCollection).toHaveBeenCalledWith(mockUmi, expect.objectContaining({
      name: params.name,
      uri: 'https://example.com/metadata.json',
    }));
    expect(result).toBeInstanceOf(TransactionBuilder);
  });
});