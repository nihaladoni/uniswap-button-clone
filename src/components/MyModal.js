import React from "react";
import Modal from "react-modal";
import "./modal.css";
import { closeButtonSVg } from "../utils/helpers";

const MyModal = (props) => {
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
