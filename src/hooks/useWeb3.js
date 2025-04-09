import { useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';

export const useWeb3 = () => {
  const { 
    account, 
    provider, 
    signer, 
    isConnected, 
    chainId, 
    networkName,
    connectWallet, 
    disconnectWallet 
  } = useContext(Web3Context);

  return { 
    account, 
    provider, 
    signer, 
    isConnected, 
    chainId, 
    networkName,
    connectWallet, 
    disconnectWallet 
  };
};