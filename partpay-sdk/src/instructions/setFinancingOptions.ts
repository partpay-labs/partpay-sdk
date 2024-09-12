import { TransactionBuilder, PublicKey, Umi } from '@metaplex-foundation/umi';
import { PARTPAY_PROGRAM_ID } from '../constants';
import { struct, u16, u64, array, Serializer, string, } from '@metaplex-foundation/umi/serializers';
import { FinancingOption } from '../types/Equipment';

type TermUnit = 'days' | 'weeks' | 'months';

const termUnitSerializer: Serializer<TermUnit> = {
  description: 'TermUnit',
  fixedSize: null,
  maxSize: 6,
  serialize: (value: TermUnit) => {
    if (!['days', 'weeks', 'months'].includes(value)) {
      throw new Error('Invalid TermUnit value');
    }
    return string().serialize(value);
  },
  deserialize: (buffer, offset) => {
    const [value, newOffset] = string().deserialize(buffer, offset);
    if (!['days', 'weeks', 'months'].includes(value as string)) {
      throw new Error('Invalid TermUnit value');
    }
    return [value as TermUnit, newOffset];
  },
};

export const setFinancingOptions = (
  umi: Umi,
  params: {
    equipment: PublicKey;
    options: FinancingOption[];
  }
): TransactionBuilder => {
  const financingOptionSerializer: Serializer<FinancingOption> = struct([
    ['term', u16()],
    ['termUnit', termUnitSerializer],
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
          term: option.term,
          termUnit: option.termUnit,
          interestRate: option.interestRate,
          minimumDownPayment: BigInt(option.minimumDownPayment),
        })),
      }),
    },
    signers: [],
    bytesCreatedOnChain: params.options.length * 32, // Estimate: 32 bytes per option, adjust if needed
  });
};