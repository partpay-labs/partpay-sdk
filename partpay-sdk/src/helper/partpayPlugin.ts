import { ProgramError, Umi, UmiPlugin, Cluster, publicKey } from "@metaplex-foundation/umi";
import { ArithmeticOverflowError, ArithmeticUnderflowError, InvalidAmountError, InvalidBorrowerError, InvalidEquipmentAddressError, InvalidFinancingOptionError, InvalidInstallmentCountError, InvalidInstallmentPlanStatusError, InvalidPaymentAmountError, InvalidPaymentDateError, InvalidVendorAddressError, NftCreationFailedError, OperationNotAllowedError, PartPayErrorCode, PaymentExceedsRemainingAmountError, UnauthorizedOperationError } from "../errors";
import { PARTPAY_PROGRAM_ID } from "../constants";

export const partpayPlugin = (): UmiPlugin => ({
  install(umi: Umi) {
    const errorResolver = (code: number, cause?: Error): ProgramError | null => {
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

    const getErrorFromName = (name: string, cause?: Error): ProgramError | null => {
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

    const partpayProgram = {
      name: 'partpay',
      publicKey: publicKey(PARTPAY_PROGRAM_ID),
      getErrorFromCode: errorResolver,
      getErrorFromName: getErrorFromName,
      isOnCluster: (cluster: Cluster) => {
        // Handle known clusters
        if (cluster === 'mainnet-beta' || cluster === 'devnet' || cluster === 'testnet') {
          return true;
        }

        if (typeof cluster === 'string') {
          return cluster.includes('mainnet') || cluster.includes('devnet');
        }
        return false;
      }
    };

    umi.programs.add(partpayProgram, true);
  },
});