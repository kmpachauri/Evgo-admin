import React from "react";
import { CModal, CModalBody, CModalHeader, CButton } from "@coreui/react";

const ImagePreviewModal = ({ imageUrl, isOpen, onClose }) => {
  return (
    <CModal visible={isOpen} onClose={onClose} size="lg" alignment="center">
      <CModalHeader closeButton>Image Preview</CModalHeader>
      <CModalBody className="text-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "8px" }}
          />
        ) : (
          <p>No image available</p>
        )}
      </CModalBody>
    </CModal>
  );
};

export default ImagePreviewModal;
