import { Umi, TransactionBuilder, generateSigner, publicKey } from '@metaplex-foundation/umi';
import { createInstallmentPlan } from '../instructions';

jest.mock('@metaplex-foundation/umi');

describe('createInstallmentPlan', () => {
  let mockUmi: jest.Mocked<Umi>;

  beforeEach(() => {
    mockUmi = {
      payer: { publicKey: publicKey('11111111111111111111111111111111') },
    } as any;
    (generateSigner as jest.Mock).mockReturnValue({
      publicKey: publicKey('22222222222222222222222222222222'),
    });
  });

  it('should create installment plan successfully', async () => {
    const params = {
      equipment: publicKey('33333333333333333333333333333333'),
      borrower: publicKey('44444444444444444444444444444444'),
      totalAmount: 1000,
      installmentCount: 12,
      interestRate: 5,
      firstPaymentDate: new Date('2023-01-01'),
    };

    const result = await createInstallmentPlan(mockUmi, params);

    expect(result).toBeInstanceOf(TransactionBuilder);
  });
});