interface PinataResponse {
  data: {
    id: string;
    name: string;
    cid: string;
    size: number;
    number_of_files: number;
    mime_type: string;
    user_id: string;
    group_id?: string;
    is_duplicate: boolean;
  };
}

export async function uploadToIpfs(
  file: File,
  metadata: Record<string, string>
): Promise<string | null> {
  const url = "https://uploads.pinata.cloud/v3/files";
  const pinataJwt = process.env.NEXT_PUBLIC_PINATA_JWT;

  const formData = new FormData();
  formData.append("file", file);

  formData.append("name", metadata.name || file.name);

  const keyvalues = JSON.stringify({
    keyvalues: {
      description: metadata.description,
      image: metadata.image,
    },
  });

  formData.append("keyvalues", keyvalues);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pinataJwt}`,
      },
      body: formData,
    });
    console.log("Response:", response);

    if (!response.ok) {
      console.error("Error uploading file to Pinata:", response.statusText);
      return null;
    }

    const result: PinataResponse = await response.json();
    console.log("Result:", result);
    const metadataURL = `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${result.data.cid}`;

    return metadataURL;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    return null;
  }
}
