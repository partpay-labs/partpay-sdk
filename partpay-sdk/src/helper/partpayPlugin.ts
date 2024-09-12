import { Umi, UmiPlugin } from "@metaplex-foundation/umi";
import { PARTPAY_PROGRAM } from "../errors";

export const partpayPlugin = (): UmiPlugin => ({
    install(umi: Umi) {
        umi.programs.add(PARTPAY_PROGRAM, true);
    },
});