// src/components/TransactionNotification.jsx
import React, { useEffect } from 'react';
import { getTransactionUrl } from '../utils/etherscan';

const TransactionNotification = ({ 
  show, 
  message = "Transaction successful!", 
  onHide, 
  autoHideTime = 5000,
  txHash = null,
  chainId = 11155111 // Default to Sepolia
}) => {
  useEffect(() => {
    if (show && autoHideTime > 0) {
      const timer = setTimeout(() => {
        if (onHide) onHide();
      }, autoHideTime);
      
      return () => clearTimeout(timer);
    }
  }, [show, autoHideTime, onHide]);

  if (!show) return null;

  return (
    <div className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded-md shadow-lg z-50 flex items-center animate-fadeIn">
      <svg 
        className="w-6 h-6 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>{message}</span>
      <button 
        onClick={onHide} 
        className="ml-4 p-1 rounded-full hover:bg-green-600 focus:outline-none"
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  );
};

export default TransactionNotification;