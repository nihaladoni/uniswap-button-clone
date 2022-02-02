import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const infuraId = process.env.INFURA_ID;

const RPC_URLS = {
  1: `https://mainnet.infura.io/v3/${infuraId}`,
  4: `https://rinkeby.infura.io/v3/${infuraId}`,
};

// Metamask
export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

// WalletConect
export const walletconnect = new WalletConnectConnector({
  rpc: {
    1: RPC_URLS[1],
    4: RPC_URLS[4],
  },
  qrcode: true,
  pollingInterval: 15000,
  infuraId: infuraId,
});

export const resetWalletConnector = (connector) => {
  if (connector && connector instanceof WalletConnectConnector) {
    connector.walletConnectProvider = undefined;
  }
};

//coinbase
export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[4],
  appName: "demo-app",
  supportedChainIds: [1, 4],
});
