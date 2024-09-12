import { Umi, TransactionBuilder, publicKey, Signer, } from '@metaplex-foundation/umi';
import { FinancingOption } from '../types';
import { setFinancingOptions } from '../instructions';
import { PARTPAY_PROGRAM_ID } from '../constants';

describe('setFinancingOptions', () => {
  let mockUmi: jest.Mocked<Umi>;

  beforeEach(() => {
    mockUmi = {
      payer: { publicKey: publicKey('11111111111111111111111111111111') } as Signer,
    } as unknown as jest.Mocked<Umi>;
  });

  it('should set financing options successfully', () => {
    const params = {
      equipment: publicKey('CuieVDEDtLo7FypA9SbLM9saXFdb1dsshEkyErMqkRQq'),
      options: [
        { term: 12, termUnit: 'months', interestRate: 5, minimumDownPayment: BigInt(1000) },
        { term: 24, termUnit: 'months', interestRate: 7, minimumDownPayment: BigInt(500) }, 
      ] as FinancingOption[],
    };

    const result = setFinancingOptions(mockUmi, params);

    expect(result).toBeInstanceOf(TransactionBuilder);
    
    // Get the instructions using the getInstructions method
    const instructions = result.getInstructions();
    
    // Check that there is one instruction
    expect(instructions).toHaveLength(1);
    
    // Get the instruction
    const instruction = instructions[0];
    
    // Check the instruction details
    expect(instruction.programId).toEqual(PARTPAY_PROGRAM_ID);
    
    // Check the number of keys in the instruction
    expect(instruction.keys).toHaveLength(2);
    
    // Check that the equipment and payer public keys are referenced
    expect(instruction.keys[0].pubkey).toEqual(params.equipment);
    expect(instruction.keys[1].pubkey).toEqual(mockUmi.payer.publicKey);
    
    // You might want to add more specific checks for the instruction data
    // depending on how your setFinancingOptions function structures the data
    expect(instruction.data).toBeDefined();
  });
});