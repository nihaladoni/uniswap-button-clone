import React from "react";
import Modal from "react-modal";
import "./modal.css";
import { closeButtonSVg } from "../utils/helpers";
import { useWeb3React } from "@web3-react/core";

const MyModal = (props) => {
  const { deactivate } = useWeb3React();
  const handleWalletDisconnect = async () => {
    try {
      await deactivate();
      localStorage.setItem("isWalletConnected", false);
      window.location.reload();
    } catch (ex) {
      console.error(ex);
    }
  };

  return (
    <div>
      <Modal
        isOpen={props.modalIsOpen}
        onRequestClose={props.closeModal}
        contentLabel="Wallet Modal"
        overlayClassName="modal-overlay"
        className="modal"
        ariaHideApp={false}
      >
        <div className="modal_content">
          <div id="modal__content--header">
            {typeof props.modalTitle === "string" ? (
              <h4>{props.modalTitle}</h4>
            ) : (
              props.modalTitle
            )}

            {localStorage.getItem("isWalletConnected") === "true" && (
              <button className="btn" onClick={handleWalletDisconnect}>
                Disconnect
              </button>
            )}
            <button
              title="Close"
              className=" clearBtn close_modal"
              onClick={props.closeModal}
            >
              {closeButtonSVg}
            </button>
          </div>
          <div id="modal__content--body">{props.children}</div>
        </div>
      </Modal>
    </div>
  );
};

export default MyModal;
