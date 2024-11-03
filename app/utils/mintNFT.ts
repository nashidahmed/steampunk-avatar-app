import { BrowserProvider, Contract } from "ethers";
import SteampunkMinter from "../artifacts/contracts/SteampunkMinter.json"; // Adjust the path to your ABI

export const mintNFT = async (metadataUrl: string) => {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return;
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    const contractAddress = process.env.NEXT_PUBLIC_ETH_SMART_CONTRACT || ""; // Replace with your contract address
    const contract = new Contract(contractAddress, SteampunkMinter.abi, signer);

    const tx = await contract.mintNFT(await signer.getAddress(), metadataUrl);
    await tx.wait();
    console.log("NFT minted successfully");
  } catch (error: any) {
    console.error("Error minting NFT:", error);

    // Log detailed error if available
    if (error.code === -32603) {
      console.error("Internal JSON-RPC Error:", error.message);
    }

    if (error.data && error.data.message) {
      console.error("Detailed error data:", error.data.message);
    } else {
      console.error("Unhandled error:", error);
    }
  }
};
