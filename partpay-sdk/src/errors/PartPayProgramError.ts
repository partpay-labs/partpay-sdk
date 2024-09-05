import { Program, ProgramError } from "@metaplex-foundation/umi";

export class PartPayProgramError extends ProgramError {
  public readonly code: number;

  constructor(name: string, code: number, message: string, program: Program) {
    // Setting the name as part of the message to preserve custom error identification
    super(`PartPay Error [${name}]: ${message}`, program);
    this.code = code;
    // Assign name indirectly by overriding the instance property
    Object.defineProperty(this, 'name', {
      value: name,
      configurable: true,
      writable: false,
      enumerable: true
    });
  }
}
