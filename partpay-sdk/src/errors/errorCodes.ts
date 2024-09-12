import { ProgramError, Program, Cluster } from "@metaplex-foundation/umi";
import { PARTPAY_PROGRAM_ID } from "../constants";


export enum PartPayErrorCode {
    NftCreationFailed = 6000,
    ArithmeticOverflow = 6001,
    ArithmeticUnderflow = 6002,
    InvalidFinancingOption = 6003,
    InvalidEquipmentAddress = 6004,
    InvalidVendorAddress = 6005,
    InvalidAmount = 6006,
    InvalidInstallmentCount = 6007,
    InvalidPaymentDate = 6008,
    InvalidBorrower = 6009,
    InvalidPaymentAmount = 6010,
    PaymentExceedsRemainingAmount = 6011,
    UnauthorizedOperation = 6012,
    InvalidInstallmentPlanStatus = 6013,
    OperationNotAllowed = 6014,
}



function getErrorMessage(code: PartPayErrorCode): string {
    return PartPayErrorCode[code] || `Unknown error: ${code}`;
}

export class NftCreationFailedError extends ProgramError {
    constructor(cause?: Error) {
        super(getErrorMessage(PartPayErrorCode.NftCreationFailed), PARTPAY_PROGRAM, cause);
    }
}

export class ArithmeticOverflowError extends ProgramError {
    constructor(cause?: Error) {
        super(getErrorMessage(PartPayErrorCode.ArithmeticOverflow), PARTPAY_PROGRAM, cause);
    }
}

export class ArithmeticUnderflowError extends ProgramError {
    constructor(cause?: Error) {
        super(getErrorMessage(PartPayErrorCode.ArithmeticUnderflow), PARTPAY_PROGRAM, cause);
    }
}

export class InvalidFinancingOptionError extends ProgramError {
    constructor(cause?: Error) {
        super(getErrorMessage(PartPayErrorCode.InvalidFinancingOption), PARTPAY_PROGRAM, cause);
    }
}

export class InvalidEquipmentAddressError extends ProgramError {
    constructor(cause?: Error) {
        super(getErrorMessage(PartPayErrorCode.InvalidEquipmentAddress), PARTPAY_PROGRAM, cause);
    }
}

export class InvalidVendorAddressError extends ProgramError {
    constructor(cause?: Error) {
        super(getErrorMessage(PartPayErrorCode.InvalidVendorAddress), PARTPAY_PROGRAM, cause);
    }
}

export class InvalidAmountError extends ProgramError {
    constructor(cause?: Error) {
        super(getErrorMessage(PartPayErrorCode.InvalidAmount), PARTPAY_PROGRAM, cause);
    }
}

export class InvalidInstallmentCountError extends ProgramError {
    constructor(cause?: Error) {
        super(getErrorMessage(PartPayErrorCode.InvalidInstallmentCount), PARTPAY_PROGRAM, cause);
    }
}

export class InvalidPaymentDateError extends ProgramError {
    constructor(cause?: Error) {
        super(getErrorMessage(PartPayErrorCode.InvalidPaymentDate), PARTPAY_PROGRAM, cause);
    }
}

export class InvalidBorrowerError extends ProgramError {
    constructor(cause?: Error) {
        super(getErrorMessage(PartPayErrorCode.InvalidBorrower), PARTPAY_PROGRAM, cause);
    }
}

export class InvalidPaymentAmountError extends ProgramError {
    constructor(cause?: Error) {
        super(getErrorMessage(PartPayErrorCode.InvalidPaymentAmount), PARTPAY_PROGRAM, cause);
    }
}

export class PaymentExceedsRemainingAmountError extends ProgramError {
    constructor(cause?: Error) {
        super(getErrorMessage(PartPayErrorCode.PaymentExceedsRemainingAmount), PARTPAY_PROGRAM, cause);
    }
}

export class UnauthorizedOperationError extends ProgramError {
    constructor(cause?: Error) {
        super(getErrorMessage(PartPayErrorCode.UnauthorizedOperation), PARTPAY_PROGRAM, cause);
    }
}

export class InvalidInstallmentPlanStatusError extends ProgramError {
    constructor(cause?: Error) {
        super(getErrorMessage(PartPayErrorCode.InvalidInstallmentPlanStatus), PARTPAY_PROGRAM, cause);
    }
}

export class OperationNotAllowedError extends ProgramError {
    constructor(cause?: Error) {
        super(getErrorMessage(PartPayErrorCode.OperationNotAllowed), PARTPAY_PROGRAM, cause);
    }
}

export function createPartPayError(code: PartPayErrorCode, message?: string, cause?: Error): ProgramError {
    return new ProgramError(message || getErrorMessage(code), PARTPAY_PROGRAM, cause);
}


export const errorResolver = (code: number, cause?: Error): ProgramError | null => {
  switch (code) {
      case PartPayErrorCode.NftCreationFailed:
          return new NftCreationFailedError(cause);
      case PartPayErrorCode.ArithmeticOverflow:
          return new ArithmeticOverflowError(cause);
      case PartPayErrorCode.ArithmeticUnderflow:
          return new ArithmeticUnderflowError(cause);
      case PartPayErrorCode.InvalidFinancingOption:
          return new InvalidFinancingOptionError(cause);
      case PartPayErrorCode.InvalidEquipmentAddress:
          return new InvalidEquipmentAddressError(cause);
      case PartPayErrorCode.InvalidVendorAddress:
          return new InvalidVendorAddressError(cause);
      case PartPayErrorCode.InvalidAmount:
          return new InvalidAmountError(cause);
      case PartPayErrorCode.InvalidInstallmentCount:
          return new InvalidInstallmentCountError(cause);
      case PartPayErrorCode.InvalidPaymentDate:
          return new InvalidPaymentDateError(cause);
      case PartPayErrorCode.InvalidBorrower:
          return new InvalidBorrowerError(cause);
      case PartPayErrorCode.InvalidPaymentAmount:
          return new InvalidPaymentAmountError(cause);
      case PartPayErrorCode.PaymentExceedsRemainingAmount:
          return new PaymentExceedsRemainingAmountError(cause);
      case PartPayErrorCode.UnauthorizedOperation:
          return new UnauthorizedOperationError(cause);
      case PartPayErrorCode.InvalidInstallmentPlanStatus:
          return new InvalidInstallmentPlanStatusError(cause);
      case PartPayErrorCode.OperationNotAllowed:
          return new OperationNotAllowedError(cause);
      default:
          return null;
  }
};

export const getErrorFromName = (name: string, cause?: Error): ProgramError | null => {
  switch (name) {
      case 'NftCreationFailed':
          return new NftCreationFailedError(cause);
      case 'ArithmeticOverflow':
          return new ArithmeticOverflowError(cause);
      case 'ArithmeticUnderflow':
          return new ArithmeticUnderflowError(cause);
      case 'InvalidFinancingOption':
          return new InvalidFinancingOptionError(cause);
      case 'InvalidEquipmentAddress':
          return new InvalidEquipmentAddressError(cause);
      case 'InvalidVendorAddress':
          return new InvalidVendorAddressError(cause);
      case 'InvalidAmount':
          return new InvalidAmountError(cause);
      case 'InvalidInstallmentCount':
          return new InvalidInstallmentCountError(cause);
      case 'InvalidPaymentDate':
          return new InvalidPaymentDateError(cause);
      case 'InvalidBorrower':
          return new InvalidBorrowerError(cause);
      case 'InvalidPaymentAmount':
          return new InvalidPaymentAmountError(cause);
      case 'PaymentExceedsRemainingAmount':
          return new PaymentExceedsRemainingAmountError(cause);
      case 'UnauthorizedOperation':
          return new UnauthorizedOperationError(cause);
      case 'InvalidInstallmentPlanStatus':
          return new InvalidInstallmentPlanStatusError(cause);
      case 'OperationNotAllowed':
          return new OperationNotAllowedError(cause);
      default:
          return null;
  }
};

export const PARTPAY_PROGRAM: Program = {
  publicKey: PARTPAY_PROGRAM_ID,
  name: 'PartPay',
  getErrorFromCode: errorResolver,
  getErrorFromName: getErrorFromName,
  isOnCluster: (cluster: Cluster) => {
      if (cluster === 'mainnet-beta' || cluster === 'devnet' || cluster === 'testnet') {
          return true;
      }
      if (typeof cluster === 'string') {
          return cluster.includes('mainnet') || cluster.includes('devnet');
      }
      return false;
  }
};