import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        const signer = await provider.getSigner();
        setSigner(signer);
        
        setAccount(accounts[0]);
        setIsConnected(true);
        
        const network = await provider.getNetwork();
        setChainId(network.chainId);
        
        return true;
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
        return false;
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this app.");
      return false;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    setChainId(null);
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      return () => {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      };
    }
  }, []);

  return (
    <Web3Context.Provider 
      value={{ 
        account, 
        provider, 
        signer,
        isConnected, 
        chainId,
        connectWallet, 
        disconnectWallet 
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};