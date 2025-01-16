import { Icon } from '@iconify/react';
import React from 'react';
import './SuccessModal.css';

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">
          <Icon icon="mdi:check-circle" width="3rem" height="3rem" />
        </div>
        <p className="success-message">{message}</p>
        <button className="success-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal; 