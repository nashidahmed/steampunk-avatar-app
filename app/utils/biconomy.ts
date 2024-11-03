import { JsonRpcProvider, Wallet } from "ethers";
import { createSmartAccountClient } from "@biconomy/account";

export const initBiconomy = async () => {
  // Initialize the JSON-RPC provider for Polygon Mumbai
  const provider = new JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
  const signer = new Wallet(
    process.env.NEXT_PUBLIC_ETH_PRIVATE_KEY || "",
    provider
  );

  // Initialize Biconomy's smart account client
  const smartAccount = await createSmartAccountClient({
    signer,
    chainId: 80001, // Polygon Mumbai Testnet
    bundlerUrl: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL!,
    biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY!,
  });

  return smartAccount.getSigner();
};
