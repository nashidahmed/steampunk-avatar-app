"use client"

import axios from "axios"
import { ethers } from "ethers"
import Image from "next/image"
import { useState } from "react"

export default function Home() {
  const [minting, setMinting] = useState(false)
  const [status, setStatus] = useState<string>("")
  const [prompt, setPrompt] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>("")

  const getImage = async () => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/KurtcPhotoED/Biomechanical_Steampunk",
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    )
    const result = await response.blob()
    const url = URL.createObjectURL(result)
    setImageUrl(url)
  }

  // Step 1: Upload Image to IPFS
  const uploadImageToIPFS = async (imageFile: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", imageFile)

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!,
        },
      }
    )

    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
  }

  // Step 2: Create Metadata JSON and Upload to IPFS
  const createMetadata = async (imageUrl: string): Promise<string> => {
    const metadata = {
      name: "My NFT",
      description: "This is an NFT with an image",
      image: imageUrl,
    }

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!,
        },
      }
    )

    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
  }

  // Step 3: Mint the NFT
  const mintNFT = async (metadataUrl: string) => {
    if (!window.ethereum) {
      alert("Please install MetaMask")
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()

    const contractAddress = "your_contract_address" // Replace with your contract address
    const contract = new ethers.Contract(
      contractAddress,
      MyNFTMinter.abi,
      signer
    )

    const tx = await contract.mintNFT(await signer.getAddress(), metadataUrl)
    await tx.wait()
    setStatus("NFT Minted Successfully!")
  }

  // Combine steps to handle the minting process
  const handleMint = async () => {
    if (!file) {
      alert("Please upload an image file.")
      return
    }

    setMinting(true)
    setStatus("Uploading image to IPFS...")

    try {
      // Step 1: Upload the image to IPFS
      const imageUrl = await uploadImageToIPFS(file)

      // Step 2: Create metadata and upload to IPFS
      setStatus("Creating metadata...")
      const metadataUrl = await createMetadata(imageUrl)

      // Step 3: Mint the NFT with the metadata URL
      setStatus("Minting NFT on Polygon...")
      await mintNFT(metadataUrl)
    } catch (error) {
      console.error("Error minting NFT:", error)
      setStatus("Error minting NFT. Check console for details.")
    } finally {
      setMinting(false)
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <header className="text-8xl font-[family-name:var(--font-wake-snake)]">
          Steampunk Avatar
        </header>
        {imageUrl && (
          <div className="relative p-5 bg-gray-900 rounded-lg border-4 border-steampunk-bronze shadow-cyberpunk">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <Image
                className="w-full h-auto rounded"
                src={imageUrl}
                alt="Cyberpunk Avatar"
                width={180}
                height={38}
                priority
              />
            )}
          </div>
        )}
        <input
          type="text"
          placeholder="Enter something..."
          className="mt-6 p-2 w-64 rounded-lg bg-gray-800 text-white border-2 border-steampunk-bronze focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-md placeholder-gray-400 text-center"
          onChange={(e) => setPrompt(e.target.value)}
        />

        {/* Button */}
        <button
          // onClick={handleGenerateAvatar}
          className="mt-4 px-6 py-2 rounded-lg bg-steampunk-bronze text-gray-800 font-bold border border-gray-600 hover:bg-gray-800 hover:text-steampunk-bronze transition-colors duration-200 ease-in-out shadow-lg shadow-cyberpunk focus:outline-none focus:ring-2 focus:ring-cyan-400"
          onClick={getImage}
        >
          Generate New Avatar
        </button>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  )
}
