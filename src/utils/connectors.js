import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const RPC_URLS = {
  1: "https://mainnet.infura.io/v3/422512bb91a947119fffc6d2f28d5705",
  4: "https://rinkeby.infura.io/v3/422512bb91a947119fffc6d2f28d5705"
};

//metamask
export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42]
});

export const walletconnect = new WalletConnectConnector({
  rpc: {
    1: RPC_URLS[1],
    4: RPC_URLS[4]
  },
  qrcode: true,
  pollingInterval: 15000,
  infuraId: "422512bb91a947119fffc6d2f28d5705"
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
  supportedChainIds: [1, 4]
});
