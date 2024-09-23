// Mock the helper module where metadataUploader is defined.
jest.mock('../helper/metadataUploader', () => ({
  ...jest.requireActual('../helper/metadataUploader'),
  metadataUploader: jest.fn(),
}));

jest.mock('@metaplex-foundation/mpl-core', () => ({
  createCollection: jest.fn().mockReturnValue({
    add: jest.fn().mockReturnValue({
      // mock the TransactionBuilder methods as needed
      sendAndConfirm: jest.fn().mockResolvedValue({ signature: 'mocked-signature' }),
    }),
  }),
}));

jest.mock('@metaplex-foundation/umi', () => ({
  ...jest.requireActual('@metaplex-foundation/umi'),
  generateSigner: jest.fn(),
}));

import { Umi, TransactionBuilder, publicKey, generateSigner } from '@metaplex-foundation/umi';
import { createCollection } from '@metaplex-foundation/mpl-core';
import { metadataUploader } from '../helper/metadataUploader'; // Import the mocked function
import { createVendor } from '../instructions';
import { Vendor } from '../types/Vendor';

describe('createVendor', () => {
  let mockUmi: jest.Mocked<Umi>;

  beforeEach(() => {
    mockUmi = {
      payer: { publicKey: publicKey('4N4XHzQVWZT9J1Wx4PSKk1Ht4fjVh9bKbZs5HoLpG9Pa') }, // Valid base58 encoded mock key
    } as any;

    (createCollection as jest.Mock).mockReturnValue({
      add: jest.fn().mockReturnValue(new TransactionBuilder()),
    });

    // Properly mock the metadataUploader function
    (metadataUploader as jest.Mock).mockResolvedValue('https://example.com/metadata.json');

    (generateSigner as jest.Mock).mockReturnValue({
      publicKey: publicKey('Fmk1XZ1XGmbpX3j7g7gM6uEQyDbVVebS9TLeZ5uNmtmH'), // Valid base58 encoded mock key
    });
  });

  it('should create a vendor successfully', async () => {
    const metadata = {} as Vendor

    const result = await createVendor(mockUmi, metadata);

    expect(metadataUploader).toHaveBeenCalledWith(mockUmi, metadata);
    expect(createCollection).toHaveBeenCalledWith(mockUmi, expect.objectContaining({
      name: metadata.name,
      uri: 'https://example.com/metadata.json',
    }));
    expect(result).toBeInstanceOf(TransactionBuilder);
  });
});
