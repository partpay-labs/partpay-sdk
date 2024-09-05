import { TransactionBuilder, PublicKey, Umi, generateSigner } from '@metaplex-foundation/umi';
import { PARTPAY_PROGRAM_ID } from '../constants';
import { struct, u64, u8, u16, i64, string } from '@metaplex-foundation/umi/serializers';

export const createInstallmentPlan = (
  umi: Umi,
  params: {
    equipment: PublicKey;
    borrower: PublicKey;
    totalAmount: number;
    installmentCount: number;
    interestRate: number;
    firstPaymentDate: Date;
    termUnit: 'days' | 'weeks' | 'months';
  }
): TransactionBuilder => {
  const installmentPlan = generateSigner(umi);

  return (new TransactionBuilder()).add({
    instruction: {
      programId: PARTPAY_PROGRAM_ID,
      keys: [
        { pubkey: params.equipment, isSigner: false, isWritable: true },
        { pubkey: params.borrower, isSigner: true, isWritable: true },
        { pubkey: installmentPlan.publicKey, isSigner: true, isWritable: true },
        { pubkey: umi.payer.publicKey, isSigner: true, isWritable: true },
      ],
      data: struct([
        ['totalAmount', u64()],
        ['installmentCount', u8()],
        ['interestRate', u16()],
        ['firstPaymentDate', i64()],
        ['termUnit', string()],
      ]).serialize({
        totalAmount: BigInt(params.totalAmount),
        installmentCount: params.installmentCount,
        interestRate: params.interestRate,
        firstPaymentDate: BigInt(params.firstPaymentDate.getTime() / 1000),
        termUnit: params.termUnit,
      }),
    },
    signers: [installmentPlan],
    bytesCreatedOnChain: 200,
  });
};