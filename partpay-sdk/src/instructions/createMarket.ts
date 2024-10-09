import { TransactionBuilder, PublicKey, Umi, generateSigner, publicKey } from '@metaplex-foundation/umi';
import { PARTPAY_PROGRAM_ID } from '../constants';
import { struct, string } from '@metaplex-foundation/umi/serializers';

/**
 * Creates a new marketplace.
 * This function initializes a new marketplace in the PartPay program.
 *
 * @param umi - The Umi object used for blockchain interactions.
 * @param params - The parameters required to create a marketplace.
 * @param params.name - The name of the marketplace.
 * @param params.uri - The URI of the marketplace metadata.
 * @returns A TransactionBuilder that handles the creation of the marketplace on-chain.
 */
export const createMarketplace = (
  umi: Umi,
  params: {
    name: string;
    uri: string;
  }
): TransactionBuilder => {
  const marketplaceSigner = generateSigner(umi);

  const [marketplacePDA] = umi.eddsa.findPda(PARTPAY_PROGRAM_ID, [
    Buffer.from("marketplace"),
    Buffer.from(umi.identity.publicKey)
  ]);

  const [marketplaceCollectionPDA] = umi.eddsa.findPda(PARTPAY_PROGRAM_ID, [
    Buffer.from("marketplace_collection"),
    Buffer.from(marketplacePDA)
  ]);

  return (new TransactionBuilder())
    .add({
      instruction: {
        programId: PARTPAY_PROGRAM_ID,
        keys: [
          { pubkey: marketplacePDA, isSigner: false, isWritable: true },
          { pubkey: marketplaceCollectionPDA, isSigner: false, isWritable: true },
          { pubkey: umi.identity.publicKey, isSigner: true, isWritable: true },
          { pubkey: umi.payer.publicKey, isSigner: true, isWritable: true },
          { pubkey: umi.programs.get("splSystem").publicKey, isSigner: false, isWritable: false },
          { pubkey: umi.programs.get("mplCore").publicKey, isSigner: false, isWritable: false },
        ],
        data: struct([
          ['instruction', string()],
          ['name', string()],
          ['uri', string()],
        ]).serialize({
          instruction: 'create_marketplace',
          name: params.name,
          uri: params.uri,
        }),
      },
      bytesCreatedOnChain: 1000,
      signers: [marketplaceSigner],
    });
};