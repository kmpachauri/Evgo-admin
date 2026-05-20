import React from 'react';
import { CSpinner } from '@coreui/react';

const LoadingSpinner = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <CSpinner color="primary" variant="grow" />
    </div>
  );
};

export default LoadingSpinner;
