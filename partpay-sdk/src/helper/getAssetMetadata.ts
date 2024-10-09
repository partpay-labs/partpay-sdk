function swapUri(uri: string): string {
  return uri.replace("arweave.net", "devnet.irys.xyz");
}

export async function fetchMetadataData(metadataUri: string) {
  try {
    const uri = swapUri(metadataUri);
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const metadataContents = await response.json();

    return metadataContents;
  } catch (error) {
    throw error;
  }
}