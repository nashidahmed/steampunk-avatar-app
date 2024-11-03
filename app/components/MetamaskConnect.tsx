// components/MetaMaskConnect.tsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const MetaMaskConnect = () => {
  const [account, setAccount] = useState<string | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = (): boolean => {
    return typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (isMetaMaskInstalled()) {
      try {
        const [selectedAccount] = await window.ethereum.request({
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
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  return (
    <div>
      {account ? (
        <p>Connected account: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
};

export default MetaMaskConnect;
