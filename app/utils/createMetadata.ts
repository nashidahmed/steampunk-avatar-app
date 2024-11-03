import axios from "axios";

export const createMetadata = async (imageUrl: string): Promise<string> => {
  const metadata = {
    name: "Steampunk NFT",
    description: "This Steampunk NFT was generated at HackNJIT",
    image: imageUrl,
  };

  const response = await axios.post(
    process.env.NEXT_PUBLIC_PINATA_BASE_URL || "",
    metadata,
    {
      headers: {
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!,
      },
    }
  );

  return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
};
