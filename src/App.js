import React, { useCallback, useState } from "react";

import MyModal from "./MyModal";

import { useWeb3React } from "@web3-react/core";
import {
  injected,
  resetWalletConnector,
  walletconnect,
  walletlink,
} from "./utils/connectors";
import {
  connectedDot,
  copyTextToClipboard,
  filterList,
  formatAccount,
  getBalanceFromAccount,
  getBalanceInOtherUnit,
  getErrorMessage,
  svgLoader,
} from "./utils/helpers";

export default function App() {
  const [loading, setLoading] = useState(false);

  const context = useWeb3React();
  const [walletError, setWalletError] = useState("");
  const [currentWallet, setCurrentWallet] = useState([]);
  const [walletBalance, setWalletBalance] = useState("");

  const [isCopied, setIsCopied] = useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);

  console.log(currentWallet);

  const connectWallet = async (myConnector) => {
    try {
      await context.activate(myConnector, undefined, true);
    } catch (error) {
      setWalletError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  console.log(currentWallet);

  //  Wallet handlers

  const handleMetamask = () => connectWallet(injected);
  const handleCoinBaseWallet = () => connectWallet(walletlink);
  // Package Issue while opening walletConnect Modal
  // https://github.com/NoahZinsmeister/web3-react/issues/124#issuecomment-984882534

  const handleWalletConnect = useCallback(async () => {
    try {
      await context.activate(walletconnect, undefined, true);
    } catch (error) {
      setWalletError(getErrorMessage(error));
      resetWalletConnector(walletconnect);
      // console.log(error);
    } finally {
      setLoading(false);
    }

    // setLoading(false);
  }, [context.activate]);

  const dataSrc = [
    {
      name: "Metamask",
      imgSrc: "https://app.uniswap.org/static/media/metamask.02e3ec27.png",
      onClick: handleMetamask,
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
    setCurrentWallet("");
    setLoading(false);
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

  const handleWalletChange = () => {
    setCurrentWallet((currentWallet) => [...currentWallet, "all"]);
  };

  if (context.active) {
    (async () => {
      const balanceInWei = await getBalanceFromAccount(context.account);
      const balanceInEth = await getBalanceInOtherUnit(balanceInWei);
      setWalletBalance(`${balanceInEth} ETH`);
    })();
  }

  return (
    <div>
      <div className="cta-buttonContainer">
        {context.active && <span> {walletBalance}</span>}
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
        modalTitle={context.active ? "Account" : "Connect Wallet"}
      >
        {/* Wallet Connect Error */}
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
        {/* Wallet Connected  */}
        {currentWallet.length >= 1 &&
          filterList(dataSrc, currentWallet[0]).map((d) => (
            <React.Fragment key={d.name}>
              {!context.active && (
                <button
                  className="card"
                  onClick={() => {
                    d.onClick();
                    if (!context.active && !context.error) {
                      setLoading(true);
                    }
                    setCurrentWallet(d.name);
                  }}
                >
                  <h3>{d.name}</h3>
                  <img src={d.imgSrc} width="24px" height="24px" alt={d.name} />
                </button>
              )}
              {!!context.active && (
                <section className="connect-container">
                  <div className="connect-container--header">
                    <p>Connected with {currentWallet[0]}</p>
                    <button className="btn" onClick={handleWalletChange}>
                      Change
                    </button>
                  </div>
                  <div className="connect-container--body">
                    <h1>{context.account && formatAccount(context.account)}</h1>
                  </div>
                  <div className="connect-container--footer">
                    <a className="myLink" onClick={handleCopyTextClick}>
                      {isCopied ? "Copied" : " Copy address"}
                    </a>
                    <a
                      href={`https://rinkeby.etherscan.io/address/${context.account}`}
                      target="#blank"
                      className="myLink"
                    >
                      View on explorer
                    </a>
                  </div>
                </section>
              )}
            </React.Fragment>
          ))}

        {/* Wallet Not Connected  */}

        {(currentWallet.length === 0 || currentWallet.includes("all")) &&
          dataSrc.map((d) => (
            <React.Fragment key={d.name}>
              {/* {walletError && (
                <button className="card" disabled>
                  <h3 style={{ color: "red" }}>{walletError}</h3>
                </button>
              )} */}
              <button
                className="card"
                onClick={() => {
                  d.onClick();
                  if (!context.active && !context.error) {
                    setLoading(true);
                  }
                  setCurrentWallet((currentWallet) => [
                    ...currentWallet,
                    d.name,
                  ]);
                }}
              >
                <div className="align-center">
                  {currentWallet.includes(d.name) ? connectedDot : null}
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
