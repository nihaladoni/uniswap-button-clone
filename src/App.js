import React, { useCallback, useState } from "react";

import "./styles.css";
import MyModal from "./MyModal";

import { useWeb3React } from "@web3-react/core";
import {
  injected,
  resetWalletConnector,
  walletconnect,
  walletlink
} from "./utils/connectors";
import { filterList, getErrorMessage } from "./utils/helpers";

export default function App() {
  // const [loading, setLoading] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [currentWallet, setCurrentWallet] = useState("");

  let loading;
  console.log(currentWallet);
  const context = useWeb3React();
  // const {
  //   active,
  //   account,
  //   library,
  //   connector,
  //   context.activate,
  //   decontext.activate,
  //   error: err
  // } = useWeb3React();

  if (!context.active && !context.error) {
  } else if (context.error) {
    setWalletError(getErrorMessage(context.error));
    //error
    // return ...
  } else {
    console.log("yyyyyyyyyyyyyyyyyy");
  }

  const handleMetamask = async () => {
    // setLoading(true);

    try {
      await context.activate(injected, undefined, true);
    } catch (error) {
      setWalletError(getErrorMessage(error));
    }

    // setLoading(false);
  };

  // Package Issue while opening walletConnect Modal

  // https://github.com/NoahZinsmeister/web3-react/issues/124#issuecomment-984882534

  const handleWalletConnect = useCallback(async () => {
    // setLoading(true);
    try {
      await context.activate(walletconnect, undefined, true);
    } catch (error) {
      resetWalletConnector(walletconnect);
      setWalletError(error);
      // console.log(error);
    }

    // setLoading(false);
  }, [context.activate]);

  const handleCoinBaseWallet = async () => {
    // setLoading(true);
    try {
      await context.activate(walletlink, undefined, true);
    } catch (ex) {
      // console.log(ex);
      setWalletError(ex);
    }
    // setLoading(false);
    setCurrentWallet("");
  };
  const dataSrc = [
    {
      name: "Metamask",
      imgSrc: "https://app.uniswap.org/static/media/metamask.02e3ec27.png",
      onClick: handleMetamask
    },
    {
      name: "WalletConnect",
      imgSrc:
        "https://app.uniswap.org/static/media/walletConnectIcon.304e3277.svg",
      onClick: handleWalletConnect
    },
    {
      name: "Coinbase",
      imgSrc:
        "https://app.uniswap.org/static/media/coinbaseWalletIcon.a3a7d7fd.svg",
      onClick: handleCoinBaseWallet
    }
  ];

  const [modalIsOpen, setIsOpen] = React.useState(false);

  const svgLoader = (
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

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setWalletError("");
    setCurrentWallet("");
  }

  return (
    <div className="App">
      <button className="cta-buttton" onClick={openModal}>
        Connect Wallet
      </button>

      <MyModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        modalTitle="Connect Wallet"
      >
        {(filterList(dataSrc, currentWallet) || dataSrc).map((d) => (
          <React.Fragment key={d.name}>
            {loading && (
              <button className="card" disabled>
                <div>{svgLoader}</div>
                <h3>Initializing ....</h3>
              </button>
            )}
            {walletError && (
              <button className="card" disabled>
                <p style={{ color: "red" }}>{walletError}</p>
              </button>
            )}
            <button
              className="card"
              onClick={() => {
                d.onClick();
                loading = true;
                setCurrentWallet(d.name);
              }}
            >
              <h3>{d.name}</h3>
              <img src={d.imgSrc} width="24px" height="24px" alt={d.name} />
            </button>
          </React.Fragment>
        ))}
      </MyModal>
    </div>
  );
}
