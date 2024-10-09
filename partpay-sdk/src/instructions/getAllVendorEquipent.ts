import { Umi, PublicKey, publicKey } from "@metaplex-foundation/umi";
import { PARTPAY_PROGRAM_ID } from "../constants";
import { getVendor } from "./getVendor";
import { DeserializedEquipment, deserializeEquipment } from "../account/EquipmentAccount";
import { PublicKey as Pubkey} from "@solana/web3.js"

export async function getAllVendorEquipment(umi: Umi, vendorPubkey: PublicKey): Promise<DeserializedEquipment[]> {
  try {
    // First, get the vendor account to know how many equipment items to expect
    const vendor = await getVendor(umi, vendorPubkey);
    const equipmentCount = vendor.equipmentCount;

    const equipmentPromises: Promise<DeserializedEquipment | null>[] = [];

    for (let i = 0; i < equipmentCount; i++) {
      const [equipmentPDA] = umi.eddsa.findPda(PARTPAY_PROGRAM_ID, [
        Buffer.from("equipment"),
        new Pubkey(vendorPubkey).toBuffer(),
        Buffer.from(new Uint32Array([i]).buffer),
      ]);

      equipmentPromises.push(
        umi.rpc.getAccount(equipmentPDA)
          .then(accountInfo => {
            if (!accountInfo.exists) {
              console.warn(`Equipment account ${equipmentPDA.toString()} does not exist`);
              return null;
            }
            return deserializeEquipment(Buffer.from(accountInfo.data));
          })
          .catch(error => {
            throw error
            return null;
          })
      );
    }

    const equipmentResults = await Promise.all(equipmentPromises);
    const validEquipment = equipmentResults.filter((equipment): equipment is DeserializedEquipment => equipment !== null);

    return validEquipment;
  } catch (error) {
    throw error;
  }
}