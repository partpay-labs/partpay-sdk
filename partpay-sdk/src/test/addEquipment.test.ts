import { Umi, TransactionBuilder, publicKey, generateSigner } from '@metaplex-foundation/umi';
import { create, fetchCollection } from '@metaplex-foundation/mpl-core';
import { metadataUploader } from '../helper/metadataUploader';
import { EquipmentMetadata } from '../types';
import { addEquipment } from '../instructions';

// Mock named exports from @metaplex-foundation/umi
jest.mock('@metaplex-foundation/umi', () => ({
  ...jest.requireActual('@metaplex-foundation/umi'), // Import the actual implementation
  generateSigner: jest.fn(), // Mock the generateSigner function
}));

jest.mock('../helper/metadataUploader', () => ({
  metadataUploader: jest.fn().mockResolvedValue('https://example.com/metadata.json'),
}));

// Mock other modules
jest.mock('@metaplex-foundation/mpl-core');
jest.mock('../helper/metadataUploader');

describe('addEquipment', () => {
  let mockUmi: jest.Mocked<Umi>;

  beforeEach(() => {
    mockUmi = {
      payer: { publicKey: publicKey('9q9bmAhVpEz2J53uKrFG9KLWfyAZ2QLrHf83M6jtSpd5') },
    } as any;

    (create as jest.Mock).mockReturnValue({
      add: jest.fn().mockReturnValue(new TransactionBuilder()),
    });
    (fetchCollection as jest.Mock).mockResolvedValue({
      publicKey: publicKey('F6nbyfiV2Uo8xUQzqxukm3tA76jF69X7Cz69pSgFB3pG'),
      oracles: [],
      lifecycleHooks: [],
    });
    (metadataUploader as jest.Mock).mockResolvedValue('https://example.com/metadata.json');
    (generateSigner as jest.Mock).mockReturnValue({
      publicKey: publicKey('B93rD7aMUM7c2gYf3Hh4unqAfRk7Wc7Xp2NFh5UVQ3Vo'),
    });
  });

  it('should add equipment successfully', async () => {
    const params = {
      owner: publicKey('9q9bmAhVpEz2J53uKrFG9KLWfyAZ2QLrHf83M6jtSpd5'),
      vendor: publicKey('F6nbyfiV2Uo8xUQzqxukm3tA76jF69X7Cz69pSgFB3pG'),
      name: 'Test Equipment',
      metadata: {} as EquipmentMetadata,
    };
  
    const result = await addEquipment(mockUmi, params);
  
    // Check what arguments metadataUploader was called with
    expect(metadataUploader).toHaveBeenCalledWith(mockUmi, { metadata: params.metadata });
  
    expect(fetchCollection).toHaveBeenCalledWith(mockUmi, params.vendor);
    expect(create).toHaveBeenCalledWith(mockUmi, expect.objectContaining({
      name: params.name,
      uri: 'https://example.com/metadata.json',
    }));
    expect(result).toBeInstanceOf(TransactionBuilder);
  });
});
