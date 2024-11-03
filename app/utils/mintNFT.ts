// utils/mintNFT.ts
import { BrowserProvider, Contract } from "ethers";
import MyNFTMinter from "../artifacts/contracts/MyNFTMinter.json"; // Adjust the path to your ABI

export const mintNFT = async (metadataUrl: string) => {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return;
  }

  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();

  const contractAddress = process.env.NEXT_PUBLIC_ETH_SMART_CONTRACT || ""; // Replace with your contract address
  const contract = new Contract(contractAddress, MyNFTMinter.abi, signer);

  const tx = await contract.mintNFT(await signer.getAddress(), metadataUrl);
  await tx.wait();
};
