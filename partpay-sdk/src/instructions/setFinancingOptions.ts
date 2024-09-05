import { TransactionBuilder, PublicKey, Umi } from '@metaplex-foundation/umi';
import { PARTPAY_PROGRAM_ID } from '../constants';
import { struct, u8, u16, u64, array, Serializer } from '@metaplex-foundation/umi/serializers';
import { FinancingOption } from '../types/Equipment';

export const setFinancingOptions = (
  umi: Umi,
  params: {
    equipment: PublicKey;
    options: FinancingOption[];
  }
): TransactionBuilder => {
  const financingOptionSerializer: Serializer<FinancingOption> = struct([
    ['termMonths', u8()],
    ['interestRate', u16()],
    ['minimumDownPayment', u64()],
  ]);

  return (new TransactionBuilder()).add({
    instruction: {
      programId: PARTPAY_PROGRAM_ID,
      keys: [
        { pubkey: params.equipment, isSigner: false, isWritable: true },
        { pubkey: umi.payer.publicKey, isSigner: true, isWritable: true },
      ],
      data: struct([
        ['options', array(financingOptionSerializer)],
      ]).serialize({
        options: params.options.map(option => ({
          termMonths: option.termMonths,
          interestRate: option.interestRate,
          minimumDownPayment: BigInt(option.minimumDownPayment),
        })),
      }),
    },
    signers: [],
    bytesCreatedOnChain: 0, // Adjust if this instruction creates or expands any accounts
  });
};