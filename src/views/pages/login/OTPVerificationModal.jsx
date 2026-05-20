import React, { useState } from "react";
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CButton,
  CForm,
  CRow,
  CCol,
  CSpinner,
} from "@coreui/react";
import { motion } from "framer-motion";
import { FaRegEnvelope, FaSyncAlt } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import color from "../../color";

const OTPVerificationModal = ({
  visible,
  onClose,
  onVerify,
  email,
  loading,
  error,
}) => {
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = () => {
    if (otp.trim().length === 0) return;
    onVerify(otp);
  };

  

  const modalVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 15 },
    },
  };

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      backdrop="static"
      alignment="center"
      size="md"
      className="otp-modal-container"
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        className="rounded-3xl overflow-hidden shadow-lg"
      >
        <CModalHeader
          className="d-flex align-items-center justify-content-between bg-light border-0"
        >
          <CModalTitle className="fw-bold d-flex align-items-center text-black gap-2">
            <FaRegEnvelope className="text-primary" />
            OTP Verification
          </CModalTitle>
          <IoMdCloseCircleOutline
            size={28}
            color="gray"
            className="cursor-pointer"
            onClick={onClose}
          />
        </CModalHeader>

        <CModalBody className="text-center p-4">
          <p className="text-muted mb-3">
            An OTP has been sent to your email:
            <br />
            <strong>{email}</strong>
          </p>

          <CForm
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
          >
            <CRow className="justify-content-center mb-3">
              <CCol xs="8">
                <motion.input
                  whileFocus={{ scale: 1.03 }}
                  whileHover={{ scale: 1.02 }}
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="form-control text-center fw-bold fs-5 py-3 border border-primary rounded-3"
                  style={{
                    letterSpacing: "4px",
                  }}
                />
              </CCol>
            </CRow>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-danger small mb-2"
              >
                {error}
              </motion.div>
            )}

            <CRow className="justify-content-center mt-3">
              <CCol xs="12">
                <CButton
                  color="primary"
                  className="w-100 py-3 fw-semibold shadow-sm rounded-3"
                  disabled={loading}
                  onClick={handleVerify}
                >
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" /> Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </CButton>
              </CCol>
            </CRow>

          </CForm>
        </CModalBody>
      </motion.div>
    </CModal>
  );
};

export default OTPVerificationModal;
