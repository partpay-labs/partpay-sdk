import { publicKey, Umi, TransactionBuilder, RpcConfirmTransactionResult } from '@metaplex-foundation/umi';
import { getEquipment } from '../instructions';
import { deserializeEquipment } from '../helper/deserializeEquipment';
import { EquipmentMetadata } from '../types/Equipment';

jest.mock('../helper/deserializeEquipment');

describe('getEquipment', () => {
  let mockUmi: Partial<Umi>;
  const validPublicKey = 'CuieVDEDtLo7FypA9SbLM9saXFdb1dsshEkyErMqkRQq';

  beforeEach(() => {
    mockUmi = {
      rpc: {
        getAccount: jest.fn(),
        getLatestBlockhash: jest.fn().mockResolvedValue({ blockhash: 'mock-blockhash' }),
        sendTransaction: jest.fn().mockResolvedValue({ signature: 'mock-signature' }),
      },
    } as unknown as Partial<Umi>;

    // Mock the TransactionBuilder class if needed
    jest.spyOn(TransactionBuilder.prototype, 'sendAndConfirm').mockImplementation(async () => {
      return {
        signature: new Uint8Array([/* mock signature data */]), // Simulate a valid signature
        result: {
          context: { // Add the missing `context` property
            slot: 12345, // Mock slot value
            err: null, // Mock error value
          },
          value: {
            err: null, // Simulate no errors
          },
        } as RpcConfirmTransactionResult,
      };
    });
  });

  it('should fetch equipment successfully', async () => {
    const equipmentPubkey = publicKey(validPublicKey);
    const mockAccountData = new Uint8Array([/* mocked account data */]);
    (mockUmi.rpc!.getAccount as jest.Mock).mockResolvedValue({
      exists: true,
      data: mockAccountData,
    });

    const mockEquipmentMetadata: EquipmentMetadata = {
      name: "Heavy Duty Excavator",
      description: "A powerful excavator suitable for large-scale construction projects",
      image: "https://example.com/excavator-image.jpg",
      images: ["https://example.com/excavator-image1.jpg", "https://example.com/excavator-image2.jpg"],
      owner: publicKey(validPublicKey),
      vendorId: publicKey(validPublicKey),
      walletAddress: publicKey(validPublicKey),
      price: 500000,
      currency: "USD",
      stockQuantity: 5,
      isActive: true,
      brand: "ConstructPro",
      model: "CP-5000",
      serialNumber: "CP5000-2023-0042",
      condition: "new",
      manufactureDate: new Date("2023-01-01"),
      financingOptions: [
        {
          term: 12,
          termUnit: "months",
          interestRate: 5,
          minimumDownPayment: BigInt(50000)
        }
      ]
    };

    (deserializeEquipment as jest.Mock).mockReturnValue(mockEquipmentMetadata);

    const result = await getEquipment(mockUmi as Umi, equipmentPubkey);

    expect(mockUmi.rpc!.getAccount).toHaveBeenCalledWith(equipmentPubkey);
    expect(deserializeEquipment).toHaveBeenCalledWith(mockAccountData);
    expect(result).toEqual(mockEquipmentMetadata);
    
    // Additional specific checks
    expect(result.name).toBe("Heavy Duty Excavator");
    expect(result.price).toBe(500000);
    expect(result.images).toHaveLength(2);
    expect(result.financingOptions).toHaveLength(1);
    expect(result.isActive).toBe(true);
  });

  it('should throw an error if equipment does not exist', async () => {
    const equipmentPubkey = publicKey(validPublicKey);
    (mockUmi.rpc!.getAccount as jest.Mock).mockResolvedValue({ exists: false });

    await expect(getEquipment(mockUmi as Umi, equipmentPubkey)).rejects.toThrow('Equipment account does not exist');
  });
});
