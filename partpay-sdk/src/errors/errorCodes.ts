import { ProgramError } from "@metaplex-foundation/umi";

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

  export class NftCreationFailedError extends ProgramError {
    constructor(cause?: Error) {
      super('NFT creation failed', PartPayErrorCode.NftCreationFailed, cause);
    }
  }
  
  export class ArithmeticOverflowError extends ProgramError {
    constructor(cause?: Error) {
      super('Arithmetic overflow', PartPayErrorCode.ArithmeticOverflow, cause);
    }
  }
  
  export class ArithmeticUnderflowError extends ProgramError {
    constructor(cause?: Error) {
      super('Arithmetic underflow', PartPayErrorCode.ArithmeticUnderflow, cause);
    }
  }
  
  export class InvalidFinancingOptionError extends ProgramError {
    constructor(cause?: Error) {
      super('Invalid financing option selected', PartPayErrorCode.InvalidFinancingOption, cause);
    }
  }
  
  export class InvalidEquipmentAddressError extends ProgramError {
    constructor(cause?: Error) {
      super('Invalid equipment address', PartPayErrorCode.InvalidEquipmentAddress, cause);
    }
  }
  
  export class InvalidVendorAddressError extends ProgramError {
    constructor(cause?: Error) {
      super('Invalid vendor address', PartPayErrorCode.InvalidVendorAddress, cause);
    }
  }
  
  export class InvalidAmountError extends ProgramError {
    constructor(cause?: Error) {
      super('Invalid amount', PartPayErrorCode.InvalidAmount, cause);
    }
  }
  
  export class InvalidInstallmentCountError extends ProgramError {
    constructor(cause?: Error) {
      super('Invalid installment count', PartPayErrorCode.InvalidInstallmentCount, cause);
    }
  }
  
  export class InvalidPaymentDateError extends ProgramError {
    constructor(cause?: Error) {
      super('Invalid payment date', PartPayErrorCode.InvalidPaymentDate, cause);
    }
  }
  
  export class InvalidBorrowerError extends ProgramError {
    constructor(cause?: Error) {
      super('Invalid borrower', PartPayErrorCode.InvalidBorrower, cause);
    }
  }
  
  export class InvalidPaymentAmountError extends ProgramError {
    constructor(cause?: Error) {
      super('Invalid payment amount', PartPayErrorCode.InvalidPaymentAmount, cause);
    }
  }
  
  export class PaymentExceedsRemainingAmountError extends ProgramError {
    constructor(cause?: Error) {
      super('Payment exceeds remaining amount', PartPayErrorCode.PaymentExceedsRemainingAmount, cause);
    }
  }
  
  export class UnauthorizedOperationError extends ProgramError {
    constructor(cause?: Error) {
      super('Unauthorized operation', PartPayErrorCode.UnauthorizedOperation, cause);
    }
  }
  
  export class InvalidInstallmentPlanStatusError extends ProgramError {
    constructor(cause?: Error) {
      super('Invalid installment plan status', PartPayErrorCode.InvalidInstallmentPlanStatus, cause);
    }
  }
  
  export class OperationNotAllowedError extends ProgramError {
    constructor(cause?: Error) {
      super('Operation not allowed in current status', PartPayErrorCode.OperationNotAllowed, cause);
    }
  }
