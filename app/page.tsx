"use client";

import axios from "axios";
import { Contract, BrowserProvider } from "ethers";
import { useState } from "react";
import MyNFTMinter from "./artifacts/contracts/MyNFTMinter.json";
import MetaMaskConnect from "./components/MetamaskConnect";
import { createMetadata } from "./utils/createMetadata";
import { mintNFT } from "./utils/mintNFT";
import { uploadToIpfs } from "./utils/uploadToIpfs";

export default function Home() {
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [file, setFile] = useState<File>();

  const getImage = async () => {
    setLoading(true);
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY || "",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );
    const result = await response.blob();
    const url = URL.createObjectURL(result);
    const file = new (File as any)([result], "Steampunk NFT", {
      type: result.type,
    });

    console.log(file);

    setFile(file);
    setLoading(false);
    setImageUrl(url);
  };

  // Combine steps to handle the minting process
  const handleMint = async () => {
    if (!file) {
      alert("Image not generated");
      return;
    }

    setMinting(true);
    setStatus("Uploading image to IPFS...");

    const metadata = {
      name: "Steampunk NFT",
      description: "This Steampunk NFT was generated at HackNJIT",
      image: imageUrl,
      attributes: [],
    };

    try {
      const metadataURL = await uploadToIpfs(file, metadata);
      console.log("Metadata URL:", metadataURL);

      setStatus("Minting NFT on Polygon...");
      await mintNFT(metadataURL || "");

      setStatus("Successfully minted");
    } catch (error) {
      console.error("Error minting NFT:", error);
      setStatus("Error minting NFT. Check console for details.");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16">
      <header className="mt-3 flex flex-col">
        <div className="text-8xl font-[family-name:var(--font-wake-snake)]">
          Steampunk Avatar
        </div>

        <MetaMaskConnect />
      </header>
      <main className="flex flex-col w-full gap-8 row-start-2 items-center">
        <div className="flex w-full">
          <div className="flex-1 p-5 items-start bg-gray-900 rounded-lg border-4 border-steampunk-bronze shadow-cyberpunk">
            {loading ? (
              <div>Loading...</div>
            ) : (
              imageUrl && (
                <img
                  className="w-72 h-auto rounded"
                  src={imageUrl}
                  alt="Cyberpunk Avatar"
                  width={64}
                  height={38}
                />
              )
            )}
          </div>
          <div className="flex flex-1 flex-col w-fit">
            <input
              type="text"
              placeholder="Enter something..."
              className="mt-6 p-2 w-64 rounded-lg bg-gray-800 text-white border-2 border-steampunk-bronze focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-md placeholder-gray-400 text-center"
              onChange={(e) => setPrompt(e.target.value)}
            />

            {/* Button */}
            <button
              // onClick={handleGenerateAvatar}
              className="mt-4 px-6 py-2 rounded-lg bg-steampunk-bronze text-gray-800 font-bold border border-gray-600 hover:bg-gray-800 hover:text-steampunk-bronze transition-colors duration-200 ease-in-out shadow-cyberpunk focus:outline-none focus:ring-2 focus:ring-cyan-400"
              onClick={getImage}
            >
              Generate New Avatar
            </button>
            {/* <button
              className="mt-4 px-6 py-2 rounded-lg bg-steampunk-bronze text-gray-800 font-bold border border-gray-600 hover:bg-gray-800 hover:text-steampunk-bronze transition-colors duration-200 ease-in-out shadow-lg shadow-cyberpunk focus:outline-none focus:ring-2 focus:ring-cyan-400"
              onClick={downloadImage}
            >
              Download
            </button> */}
            <a
              href={imageUrl}
              download={"Steampunk NFT.jpg"}
              className="mt-4 px-6 py-2 rounded-lg bg-steampunk-bronze text-gray-800 font-bold border border-gray-600 hover:bg-gray-800 hover:text-steampunk-bronze transition-colors duration-200 ease-in-out shadow-cyberpunk focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              Download image
            </a>
            <button
              className="mt-4 px-6 py-2 rounded-lg bg-steampunk-bronze text-gray-800 font-bold border border-gray-600 hover:bg-gray-800 hover:text-steampunk-bronze transition-colors duration-200 ease-in-out shadow-cyberpunk focus:outline-none focus:ring-2 focus:ring-cyan-400"
              onClick={handleMint}
            >
              Mint NFT
            </button>
            {status}
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Testing
      </footer>
    </div>
  );
}
