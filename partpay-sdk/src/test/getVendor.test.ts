import { publicKey, Umi } from '@metaplex-foundation/umi';
import { getVendor } from '../instructions';

describe('getVendor', () => {
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

    it('should fetch vendor successfully', async () => {
        const vendorPubkey = publicKey('11111111111111111111111111111111');
        mockGetAccount.mockResolvedValue({
            exists: true,
            data: new Uint8Array([/* mocked account data */]),
        });

        const result = await getVendor(mockUmi as Umi, vendorPubkey);

        expect(mockGetAccount).toHaveBeenCalledWith(vendorPubkey);
        expect(result).toBeDefined();
        // Add more specific assertions based on your VendorData structure
    });

    it('should throw an error if vendor does not exist', async () => {
        const vendorPubkey = publicKey('22222222222222222222222222222222');
        mockGetAccount.mockResolvedValue({ exists: false });

        await expect(getVendor(mockUmi as Umi, vendorPubkey)).rejects.toThrow('Vendor account does not exist');
    });
});