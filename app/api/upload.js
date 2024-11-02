import axios from "axios"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { image } = req.body

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        image,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: process.env.PINATA_API_KEY,
            pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
          },
        }
      )
      res
        .status(200)
        .json({
          url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
        })
    } catch (error) {
      res.status(500).json({ error: "Failed to upload image to IPFS" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
