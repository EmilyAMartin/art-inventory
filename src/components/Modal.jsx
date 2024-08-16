import React from "react";
import "./Modal.css";

const Modal = ({ onSubmit, onCancel, closeModal, children }) => {
  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container")
          closeModal("Modal was closed");
      }}
    >
      <div className="modal">
        <div
          className="modal-header"
          onClick={() => closeModal("Modal was closed")}
        >
          <p className="close">&times;</p>
        </div>
        <div className="modal-content">{children}</div>
        <div className="modal-footer">
          <button
            type="submit"
            className="submit-button"
            onClick={() => onSubmit("Submit button was clicked")}
          >
            Submit
          </button>
          <button
            type="submit"
            className="cancel-button"
            onClick={() => onCancel("Cancel button was clicked")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default Modal