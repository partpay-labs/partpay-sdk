import { PublicKey } from "@metaplex-foundation/umi";

class Pubkey {
  constructor(public key: Uint8Array) {
    if (key.length !== 32) {
      throw new Error('Pubkey must be 32 bytes');
    }
  }

  static fromBuffer(buffer: Buffer): Pubkey {
    return new Pubkey(new Uint8Array(buffer));
  }

  toBuffer(): Buffer {
    return Buffer.from(this.key);
  }
}

class VendorAccount {
  constructor(
    public authority: Pubkey,
    public collection: Pubkey,
    public name: string,
    public uri: string,
    public marketplace: Pubkey | null,
    public equipmentCount: bigint,
    public uniqueId: Pubkey
  ) {}

  static deserialize(buffer: Buffer): VendorAccount {
    let offset = 0;

    function readPubkey(): Pubkey {
      const pubkeyBytes = buffer.slice(offset, offset + 32);
      offset += 32;
      return Pubkey.fromBuffer(pubkeyBytes);
    }

    function readString(): string {
      const len = buffer.readUInt32LE(offset);
      offset += 4;
      const str = buffer.slice(offset, offset + len).toString('utf8');
      offset += len;
      return str;
    }

    function readBigInt(): bigint {
      const value = buffer.readBigUInt64LE(offset);
      offset += 8;
      return value;
    }

    const authority = readPubkey();
    const collection = readPubkey();
    const name = readString();
    const uri = readString();
    
    const hasMarketplace = buffer.readUInt8(offset) === 1;
    offset += 1;
    const marketplace = hasMarketplace ? readPubkey() : null;
    
    const equipmentCount = readBigInt();
    const uniqueId = readPubkey();

    return new VendorAccount(
      authority,
      collection,
      name,
      uri,
      marketplace,
      equipmentCount,
      uniqueId
    );
  }

  serialize(): Buffer {
    const buffers: Buffer[] = [];

    buffers.push(this.authority.toBuffer());
    buffers.push(this.collection.toBuffer());
    
    const nameBuffer = Buffer.from(this.name, 'utf8');
    const nameLengthBuffer = Buffer.alloc(4);
    nameLengthBuffer.writeUInt32LE(nameBuffer.length);
    buffers.push(nameLengthBuffer);
    buffers.push(nameBuffer);
    
    const uriBuffer = Buffer.from(this.uri, 'utf8');
    const uriLengthBuffer = Buffer.alloc(4);
    uriLengthBuffer.writeUInt32LE(uriBuffer.length);
    buffers.push(uriLengthBuffer);
    buffers.push(uriBuffer);
    
    buffers.push(Buffer.from([this.marketplace ? 1 : 0]));
    if (this.marketplace) {
      buffers.push(this.marketplace.toBuffer());
    }
    
    const equipmentCountBuffer = Buffer.alloc(8);
    equipmentCountBuffer.writeBigUInt64LE(this.equipmentCount);
    buffers.push(equipmentCountBuffer);
    
    buffers.push(this.uniqueId.toBuffer());

    return Buffer.concat(buffers);
  }
}

export function deserializeVendorAccount(accountData: Buffer): VendorAccount {
  // Skip the 8-byte discriminator
  const dataWithoutDiscriminator = accountData.slice(8);
  return VendorAccount.deserialize(dataWithoutDiscriminator);
}