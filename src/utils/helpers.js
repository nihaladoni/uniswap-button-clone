import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { UserRejectedRequestError as walletConnectUserRejectedRequestError } from "@web3-react/walletconnect-connector";

import Web3 from "web3";

const web3 = new Web3(Web3.givenProvider || "http://localhost:3000");

export const getErrorMessage = (errorObj) => {
  let errorMessage;
  switch (true) {
    case errorObj instanceof UserRejectedRequestError:
      errorMessage = "You rejected the wallet request";
      break;
    case errorObj instanceof walletConnectUserRejectedRequestError:
      errorMessage = "You rejected the wallet request";
      break;
    case errorObj.code === -32002:
      errorMessage =
        "A wallet request is already running. Please click on metamask extension and login.";
      break;

    default:
      errorMessage = "Something went wrong";
      break;
  }
  return errorMessage;
};

export const filterList = (arr, criteria) => {
  if (criteria) return arr.filter((d) => d.name === criteria);
};

export const formatAccount = (acc) => `${acc.slice(0, 6)}...${acc.slice(-4)}`;

export const getBalanceFromAccount = async (account) =>
  await web3.eth.getBalance(account);

export const getBalanceInOtherUnit = async (balance, unit = "ether") =>
  Number(await web3.utils.fromWei(balance, unit));

export const copyTextToClipboard = (txt) =>
  window.navigator.clipboard.writeText(txt);

// Elements
export const svgLoader = (
  <svg
    width="20px"
    height="118px"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
  >
    <circle
      cx="50"
      cy="50"
      fill="none"
      stroke="#290908"
      strokeWidth="13"
      r="31"
      strokeDasharray="146.08405839192537 50.69468613064179"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        repeatCount="indefinite"
        dur="1s"
        values="0 50 50;360 50 50"
        keyTimes="0;1"
      ></animateTransform>
    </circle>
  </svg>
);

export const connectedDot = <div className="green-dot"></div>;

export const closeButtonSVg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const chainsMetadata = {
  1: {
    tokenName: "Ethereum Mainnet",
    chainId: 1,
    tokenSymbol: "ETH",
    explorerUrl: "https://etherscan.io/address",
  },
  3: {
    tokenName: "Ropsten Testnet",
    chainId: 3,
    tokenSymbol: "ETH",
    explorerUrl: "https://ropsten.etherscan.io/address",
  },
  4: {
    tokenName: "Rinkeby Testnet",
    chainId: 4,
    tokenSymbol: "ETH",
    explorerUrl: "https://rinkeby.etherscan.io/address",
  },
  5: {
    tokenName: "Goerli Testnet",
    chainId: 5,
    tokenSymbol: "ETH",
    explorerUrl: "https://goerli.etherscan.io/address",
  },
  42: {
    tokenName: "Kovan Testnet",
    chainId: 42,
    tokenSymbol: "ETH",
    explorerUrl: "https://kovan.etherscan.io/address",
  },
  97: {
    tokenName: "Binance Smart Chain Testnet",
    chainId: 97,
    tokenSymbol: "BNB",
    explorerUrl: "https://testnet.bscscan.com/address",
  },

  5777: {
    tokenName: "Ganache",
    chainId: 5777,
    tokenSymbol: "GAN",
  },
};
