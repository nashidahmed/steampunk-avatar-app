// components/MetaMaskConnect.tsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const MetaMaskConnect = () => {
  const [account, setAccount] = useState<string | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = (): boolean | undefined => {
    return typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (isMetaMaskInstalled() && window.ethereum) {
      try {
        const [selectedAccount] = await window.ethereum.request!({
          method: "eth_requestAccounts",
        });
        setAccount(selectedAccount);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on?.("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  return (
    <div className="text-right mb-1">
      {account ? (
        <p>Connected account: {account}</p>
      ) : (
        <button
          className="px-6 py-2 w-fit disabled:opacity-40 disabled:cursor-none disabled:pointer-events-none rounded-lg bg-steampunk-bronze text-gray-800 font-bold border border-gray-600 hover:bg-gray-800 hover:text-steampunk-bronze transition-colors duration-200 ease-in-out shadow-cyberpunk focus:outline-none focus:ring-2 focus:ring-cyan-400"
          onClick={connectWallet}
        >
          Connect MetaMask
        </button>
      )}
    </div>
  );
};

export default MetaMaskConnect;
