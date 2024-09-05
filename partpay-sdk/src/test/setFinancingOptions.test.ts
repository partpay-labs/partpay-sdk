import { Umi, TransactionBuilder, publicKey } from '@metaplex-foundation/umi';
import { FinancingOption } from '../types';
import { setFinancingOptions } from '../instructions';

describe('setFinancingOptions', () => {
  let mockUmi: jest.Mocked<Umi>;

  beforeEach(() => {
    mockUmi = {
      payer: { publicKey: publicKey('11111111111111111111111111111111') },
    } as any;
  });

  it('should set financing options successfully', async () => {
    const params = {
      equipment: publicKey('22222222222222222222222222222222'),
      options: [
        { termMonths: 12, interestRate: 5, minimumDownPayment: BigInt(1000) },
        { termMonths: 24, interestRate: 7, minimumDownPayment: BigInt(500) }, 
      ] as FinancingOption[],
    };

    const result = await setFinancingOptions(mockUmi, params);

    expect(result).toBeInstanceOf(TransactionBuilder);
  });
});
