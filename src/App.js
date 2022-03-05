import React, { useCallback, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import MyModal from "./components/MyModal";

import {
  injected,
  resetWalletConnector,
  walletconnect,
  walletlink,
} from "./utils/connectors";
import {
  chainsMetadata,
  connectedDot,
  copyTextToClipboard,
  filterList,
  formatAccount,
  getBalanceFromAccount,
  getBalanceInOtherUnit,
  getErrorMessage,
  svgLoader,
} from "./utils/helpers";
import Backbutton from "./components/Backbutton";
import { useEffect } from "react/cjs/react.development";
import useChainId from "./utils/useChainId";

export default function App() {
  const context = useWeb3React();
  const myChainId = useChainId();

  const [walletError, setWalletError] = useState("");
  const [currentWalletArr, setCurrentWalletArr] = useState([]);
  const [connectedAccounts, setConnectedAccounts] = useState(() => new Set());
  const [walletBalance, setWalletBalance] = useState("");
  const [showAllAccounts, setShowAllAccounts] = useState(true);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  //  Wallet conncection handlers

  const handleMetamaskConnect = async () => {
    try {
      await context.activate(injected, undefined, true);
      localStorage.setItem("isWalletConnected", true);
      setConnectedAccounts((prev) => new Set(...prev).add("Metamask"));
    } catch (error) {
      setWalletError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };
  const handleCoinBaseWallet = async () => {
    try {
      await context.activate(walletlink, undefined, true);
      setConnectedAccounts((prev) => new Set(...prev).add("Coinbase"));
    } catch (error) {
      setWalletError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Package Issue while opening walletConnect Modal
  // https://github.com/NoahZinsmeister/web3-react/issues/124#issuecomment-984882534

  const handleWalletConnect = useCallback(async () => {
    try {
      await context.activate(walletconnect, undefined, true);
      setConnectedAccounts((prev) => new Set(...prev).add("WalletConnect"));
    } catch (error) {
      setWalletError(getErrorMessage(error));
      resetWalletConnector(walletconnect);
    } finally {
      setLoading(false);
    }
  }, [context.activate]);

  const dataSrc = [
    {
      name: "Metamask",
      imgSrc: "https://app.uniswap.org/static/media/metamask.02e3ec27.png",
      onClick: handleMetamaskConnect,
    },
    {
      name: "WalletConnect",
      imgSrc:
        "https://app.uniswap.org/static/media/walletConnectIcon.304e3277.svg",
      onClick: handleWalletConnect,
    },
    {
      name: "Coinbase",
      imgSrc:
        "https://app.uniswap.org/static/media/coinbaseWalletIcon.a3a7d7fd.svg",
      onClick: handleCoinBaseWallet,
    },
  ];

  // Modal Handlers
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setWalletError("");
    setLoading(false);
    setCurrentWalletArr([]);
    setShowAllAccounts(true);
  }

  //  Helper Handlers

  const handleCopyTextClick = (e) => {
    e.preventDefault();
    copyTextToClipboard(context.account);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 500);
  };
  const handleBackButtonClick = () => {
    setShowAllAccounts(true);
  };

  const handleWalletChange = () => {
    setShowAllAccounts(false);
  };

  if (context.active) {
    (async () => {
      const balanceInWei = await getBalanceFromAccount(context.account);
      const balanceInEth = await getBalanceInOtherUnit(balanceInWei);
      setWalletBalance(balanceInEth);
    })();
  }

  const handleWalletDisconnect = async () => {
    try {
      await context.deactivate();
      localStorage.setItem("isWalletConnected", false);
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    if (localStorage?.getItem("isWalletConnected") === "true") {
      handleMetamaskConnect();
    }
  }, []);

  return (
    <div>
      <div className="cta-buttonContainer">
        {context.active && (
          <span>
            {Number(walletBalance).toFixed(4)} &nbsp;
            {chainsMetadata[myChainId].tokenSymbol}
          </span>
        )}
        <button
          className={context.active ? "cta-button selected" : "cta-button"}
          onClick={openModal}
        >
          {context.active ? formatAccount(context.account) : "Connect Wallet"}
        </button>
      </div>

      <MyModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        modalTitle={
          context.active ? (
            showAllAccounts ? (
              "Account"
            ) : (
              <>
                {/* <button onClick={handleWalletDisconnect}>Disconnect</button> */}
                <Backbutton onClick={handleBackButtonClick} />
              </>
            )
          ) : (
            "Connect Wallet"
          )
        }
      >
        {/* Wallet loading */}
        {loading && (
          <button className="card" disabled>
            <div>{svgLoader}</div>
            <h3>Initializing ....</h3>
          </button>
        )}

        {/* Wallet Connect Error */}
        {walletError && (
          <button className="card" disabled>
            <h3 style={{ color: "red" }}>{walletError}</h3>
          </button>
        )}
        {/* Wallet select Initialization  */}
        {currentWalletArr.length >= 1 &&
          filterList(dataSrc, currentWalletArr[0]).map((d) => (
            <React.Fragment key={d.name}>
              {!context.active && (
                <button
                  className="card"
                  onClick={() => {
                    d.onClick();
                    if (!context.active && !context.error) {
                      setLoading(true);
                    }
                    setCurrentWalletArr(d.name);
                  }}
                >
                  <h3>{d.name}</h3>
                  <img src={d.imgSrc} width="24px" height="24px" alt={d.name} />
                </button>
              )}
            </React.Fragment>
          ))}

        {/* Wallet connected  */}

        {showAllAccounts && context.active && (
          <section className="connect-container">
            <div className="connect-container--header">
              <p>Connected with {[...connectedAccounts][0]}</p>
              <button className="btn" onClick={handleWalletChange}>
                Change
              </button>
            </div>
            <div className="connect-container--body">
              <h1>{context.account && formatAccount(context.account)}</h1>
            </div>
            <div className="connect-container--footer">
              <button as="a" className="clearBtn" onClick={handleCopyTextClick}>
                {isCopied ? "Copied" : " Copy address"}
              </button>
              <a
                href={`${chainsMetadata[myChainId].explorerUrl}/${context.account}`}
                target="#blank"
                className="myLink"
              >
                View on explorer
              </a>
            </div>
          </section>
        )}

        {/* Wallet Not Connected  */}

        {(!showAllAccounts || (!context.active && !loading && !walletError)) &&
          dataSrc.map((d) => (
            <React.Fragment key={d.name}>
              <button
                className="card"
                onClick={() => {
                  d.onClick();
                  if (!context.active && !context.error) {
                    setLoading(true);
                  }
                  setCurrentWalletArr((currentWalletArr) => [
                    ...currentWalletArr,
                    d.name,
                  ]);
                }}
              >
                <div className="align-center">
                  {connectedAccounts.has(d.name) ? connectedDot : null}
                  <h3>{d.name}</h3>
                </div>
                <img src={d.imgSrc} width="24px" height="24px" alt={d.name} />
              </button>
            </React.Fragment>
          ))}
      </MyModal>
    </div>
  );
}
