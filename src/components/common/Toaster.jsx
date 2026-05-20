import React, { useEffect, useRef, useState } from 'react';
import { CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react';

const ToastNotification = ({ message, type, toastId }) => {
  const [toast, setToast] = useState(null);
  const toasterRef = useRef();

  const toastColors = {
    success: { title: 'Success', color: '#28a745' },
    error: { title: 'Error', color: '#dc3545' },
    info: { title: 'Info', color: '#007bff' },
  };

  useEffect(() => {
    if (message) {
      const { title, color } = toastColors[type] || toastColors.info;

      const newToast = (
        <CToast key={toastId || Date.now()} autohide delay={3000}>
          <CToastHeader closeButton>
            <svg
              className="rounded me-2"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
              role="img"
            >
              <rect width="100%" height="100%" fill={color}></rect>
            </svg>
            <div className="fw-bold me-auto">{title}</div>
            <small>Just now</small>
          </CToastHeader>
          <CToastBody>{message}</CToastBody>
        </CToast>
      );

      setToast(newToast);
    }
  }, [toastId, message, type]); // <--- Watch toastId

  return (
    <CToaster ref={toasterRef} push={toast} placement="top-end" className="p-3" />
  );
};

export default ToastNotification;
