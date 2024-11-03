import { PinataSDK, PinResponse } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
});

export async function uploadToIpfs(
  file: File,
  metadata: {
    name: string;
    description: string;
    attributes: Array<{ trait_type: string; value: string }>;
  }
): Promise<string | null> {
  try {
    // Step 1: Upload the image file to IPFS using pinata-web3 SDK
    const fileResult: PinResponse = await pinata.upload.file(file, {
      groupId: "446d39e6-142f-4cf7-ab53-ed88d604a4cc",
      metadata: {
        name: file.name,
        keyValues: { group: "446d39e6-142f-4cf7-ab53-ed88d604a4cc" },
      },
    });

    const imageCid = fileResult.IpfsHash;
    const imageUrl = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${imageCid}`;
    console.log(fileResult);

    // Step 2: Create the metadata JSON with the image IPFS URL
    const metadataJSON = {
      name: metadata.name,
      external_url: process.env.NEXT_PUBLIC_BASE_URL,
      description: metadata.description,
      image: imageUrl,
      attributes: metadata.attributes || [],
    };
    console.log(metadataJSON);

    // Step 3: Upload the metadata JSON to IPFS
    const metadataBlob = new Blob([JSON.stringify(metadataJSON)], {
      type: "application/json",
    });
    const metadataFile = new File([metadataBlob], "metadata.json", {
      type: "application/json",
    });

    const metadataResult: PinResponse = await pinata.upload.file(metadataFile, {
      groupId: "446d39e6-142f-4cf7-ab53-ed88d604a4cc",
      metadata: {
        name: "metadata.json",
        keyValues: { group: "0192f152-648b-7d99-b3fa-5962fe986b32" },
      },
    });

    const metadataURL = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${imageCid}`;

    return metadataURL;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    return null;
  }
}
