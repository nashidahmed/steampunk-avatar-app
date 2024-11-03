// global.d.ts
interface EthereumProvider {
  isMetaMask?: boolean;
  request?: (args: { method: string; params?: Array<any> }) => Promise<any>;
  on?: (eventName: string, callback: (accounts: string[]) => void) => void;
}

interface Window {
  ethereum?: EthereumProvider;
}
