import { PublicKey as Pubkey} from "@solana/web3.js"

interface DeserializedVendorAccount {
    authority: Pubkey;
    collection: Pubkey;
    name: string;
    uri: string;
    marketplace: Pubkey | null;
    equipmentCount: bigint;
    uniqueId: Pubkey;
  }
  
  export function deserializeVendorAccount(buffer: Buffer): DeserializedVendorAccount {
    let offset = 8; // Skip the 8-byte discriminator
  
    function readPubkey(): Pubkey {
      const pubkeyBytes = buffer.slice(offset, offset + 32);
      offset += 32;
      return new Pubkey(pubkeyBytes);
    }
  
    function readString(): string {
      const len = buffer.readUInt32LE(offset);
      offset += 4;
      const str = buffer.slice(offset, offset + len).toString('utf8');
      offset += len;
      return str;
    }
  
    const authority = readPubkey();
    const collection = readPubkey();
    const name = readString();
    const uri = readString();
    
    const hasMarketplace = buffer.readUInt8(offset) === 1;
    offset += 1;
    const marketplace = hasMarketplace ? readPubkey() : null;
    
    const equipmentCount = buffer.readBigUInt64LE(offset);
    offset += 8;
    const uniqueId = readPubkey();
  
    return {
      authority,
      collection,
      name,
      uri,
      marketplace,
      equipmentCount,
      uniqueId
    };
  }