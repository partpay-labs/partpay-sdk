import { PublicKey } from "@solana/web3.js";
import { PARTPAY_PROGRAM_ID } from "../constants";

/**
 * Finds the Program Derived Address (PDA) for an installment plan.
 * 
 * @param equipmentPubkey - The public key of the equipment.
 * @param borrowerPubkey - The public key of the borrower.
 * @returns The PDA for the installment plan and the bump seed.
 */
export async function findInstallmentPlanPDA(
  equipmentPubkey: PublicKey,
  borrowerPubkey: PublicKey
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("installment_plan"),
      equipmentPubkey.toBuffer(),
      borrowerPubkey.toBuffer(),
    ],
    new PublicKey(PARTPAY_PROGRAM_ID)
  );
}
