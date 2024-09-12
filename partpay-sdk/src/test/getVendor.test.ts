// Mock required Umi and related functions
jest.mock('@metaplex-foundation/umi', () => ({
    ...jest.requireActual('@metaplex-foundation/umi'),
    TransactionBuilder: jest.fn().mockImplementation(() => ({
      add: jest.fn().mockReturnThis(),
      sendAndConfirm: jest.fn().mockResolvedValue({
        result: { value: { err: null } }, // Simulate a successful transaction without errors
      }),
    })),
  }));
  
  import { publicKey, Umi } from '@metaplex-foundation/umi';
  import { getVendor } from '../instructions';
  
  describe('getVendor', () => {
    let mockUmi: Partial<Umi>;
    const validPublicKey = 'CuieVDEDtLo7FypA9SbLM9saXFdb1dsshEkyErMqkRQq';
  
    beforeEach(() => {
      // Mock the Umi object with necessary RPC methods
      mockUmi = {
        rpc: {
          getAccount: jest.fn(),
          getLatestBlockhash: jest.fn().mockResolvedValue({ blockhash: 'mockBlockhash' }), // Ensure getLatestBlockhash is mocked
        },
      } as unknown as Partial<Umi>;
    });
  
    it('should fetch vendor successfully', async () => {
      const vendorPubkey = publicKey(validPublicKey);
      (mockUmi.rpc!.getAccount as jest.Mock).mockResolvedValue({
        exists: true,
        data: new Uint8Array([
          // Mock data for owner public key
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          // Mock data for collection address
          2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
          // Mock data for equipment count (u64)
          5, 0, 0, 0, 0, 0, 0, 0,
        ]),
      });
  
      const result = await getVendor(mockUmi as Umi, vendorPubkey);
  
      expect(mockUmi.rpc!.getAccount).toHaveBeenCalledWith(vendorPubkey);
      expect(result).toBeDefined();
      expect(result.owner).toBeDefined();
      expect(typeof result.owner).toBe('string');
      expect(result.collectionAddress).toBeDefined();
      expect(typeof result.collectionAddress).toBe('string');
      expect(result.equipmentCount).toBe(BigInt(5));
    });
  
    it('should throw an error if vendor does not exist', async () => {
      const vendorPubkey = publicKey(validPublicKey);
      (mockUmi.rpc!.getAccount as jest.Mock).mockResolvedValue({ exists: false });
  
      await expect(getVendor(mockUmi as Umi, vendorPubkey)).rejects.toThrow('Vendor account does not exist');
    });
  });
  