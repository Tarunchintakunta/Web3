// src/components/EthereumAddress.jsx
import React, { useState, useEffect } from 'react';
import { getAddressUrl, fetchAddressBalance } from '../utils/etherscan';

const EthereumAddress = ({ 
  address, 
  chainId = 11155111, 
  showBalance = false,
  label = "Address",
  className = ""
}) => {
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Format address for display (0x1234...5678)
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  // Fetch balance if showBalance is true
  useEffect(() => {
    const getBalance = async () => {
      if (showBalance && address) {
        setIsLoading(true);
        try {
          // Use environment variable for API key
          const apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
          const balance = await fetchAddressBalance(address, apiKey, chainId);
          setBalance(balance);
        } catch (error) {
          console.error('Error fetching balance:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    getBalance();
  }, [address, chainId, showBalance]);
  
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center">
        <span className="text-gray-600 mr-2">{label}:</span>
        <div className="font-medium flex items-center">
          <span className="mr-2">{formatAddress(address)}</span>
          <a
            href={getAddressUrl(address, chainId)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
            title="View on Etherscan"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </div>
      </div>
      
      {showBalance && (
        <div className="mt-1 text-sm text-gray-500">
          {isLoading ? (
            <span>Loading balance...</span>
          ) : balance ? (
            <span>Balance: {balance} ETH</span>
          ) : (
            <span>Balance not available</span>
          )}
        </div>
      )}
    </div>
  );
};

export default EthereumAddress;