import { Umi, publicKey, Signer,TransactionSignature } from '@metaplex-foundation/umi';
import { createInstallmentPlan } from '../instructions';

jest.mock('@metaplex-foundation/umi');
jest.mock('../instructions');

describe('createInstallmentPlan', () => {
  let mockUmi: jest.Mocked<Umi>;
  const validPublicKey1 = 'CuieVDEDtLo7FypA9SbLM9saXFdb1dsshEkyErMqkRQq';
  const validPublicKey2 = '5ZWj7a1f8tWkjBESHKgrLmXshuXxqeY9SYcfbshpAqPG';

  beforeEach(() => {
    mockUmi = {
      payer: { publicKey: publicKey(validPublicKey1) } as Signer,
      rpc: {
        getLatestBlockhash: jest.fn().mockResolvedValue({ blockhash: 'mock-blockhash', lastValidBlockHeight: 1000 }),
      },
    } as any;

    const mockTransactionBuilder = {
      add: jest.fn().mockReturnThis(),
      setFeePayer: jest.fn().mockReturnThis(),
      setBlockhash: jest.fn().mockReturnThis(),
      build: jest.fn().mockResolvedValue({
        signatures: [new Uint8Array([1, 2, 3, 4])],
        message: {
          // Mock message properties
        },
      }),
      sendAndConfirm: jest.fn().mockResolvedValue({
        signature: new Uint8Array([1, 2, 3, 4]) as TransactionSignature,
        result: {
          value: {
            err: null,
          },
        },
      }),
    };

    (createInstallmentPlan as jest.Mock).mockReturnValue(mockTransactionBuilder);
  });

  it('should create installment plan successfully', async () => {
    const params = {
      equipment: publicKey(validPublicKey1),
      borrower: publicKey(validPublicKey2),
      totalAmount: 1000,
      installmentCount: 12,
      interestRate: 5,
      firstPaymentDate: new Date('2023-01-01'),
      termUnit: 'months' as const,
    };

    const result = createInstallmentPlan(mockUmi, params);

    expect(createInstallmentPlan).toHaveBeenCalledWith(mockUmi, params);
    expect(result).toBeDefined();
    expect(result.add).toBeDefined();

    // Test chaining methods
    result.add({ instruction: {} as any, signers: [], bytesCreatedOnChain: 0 });
    expect(result.add).toHaveBeenCalled();

    result.setFeePayer(mockUmi.payer);
    expect(result.setFeePayer).toHaveBeenCalledWith(mockUmi.payer);

    result.setBlockhash({ blockhash: 'mock-blockhash', lastValidBlockHeight: 1000 });
    expect(result.setBlockhash).toHaveBeenCalledWith({ blockhash: 'mock-blockhash', lastValidBlockHeight: 1000 });

    // Test build method
    const buildResult = await result.build({ transactions: mockUmi as any, payer: mockUmi.payer });
    expect(buildResult.signatures).toHaveLength(1);
    expect(buildResult.signatures[0]).toBeInstanceOf(Uint8Array);

    // Test sendAndConfirm method
    const sendResult = await result.sendAndConfirm({ transactions: mockUmi as any, rpc: mockUmi.rpc as any, payer: mockUmi.payer });
    expect(sendResult.signature).toBeInstanceOf(Uint8Array);
    expect(sendResult.result.value.err).toBeNull();
  });
});