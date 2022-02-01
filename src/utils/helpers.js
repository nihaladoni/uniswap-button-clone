import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { UserRejectedRequestError as walletConnectUserRejectedRequestError } from "@web3-react/walletconnect-connector";

import Web3 from "web3";

const web3 = new Web3(Web3.givenProvider || "http://localhost:3000");

export const getErrorMessage = (errorObj) => {
  let errorMessage;
  console.log(errorObj);
  switch (true) {
    case errorObj instanceof UserRejectedRequestError:
      errorMessage = "You rejected the wallet request";
      break;
    case errorObj instanceof walletConnectUserRejectedRequestError:
      errorMessage = "You rejected the wallet request";
      break;
    case errorObj.code === -32002:
      errorMessage =
        "A wallet request is already running. Please check window panes";
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
