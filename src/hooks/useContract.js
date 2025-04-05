import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';

// Import ABI when available
import HealthStakingABI from '../contracts/HealthStaking.json';

export const useContract = (contractAddress) => {
  const { provider, signer, isConnected } = useWeb3();
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      if (!isConnected || !signer || !provider) {
        setContract(null);
        setIsLoading(false);
        return;
      }

      try {
        // For now, use an empty ABI until we have the compiled contract
        const contractABI = HealthStakingABI.abi || [];
        
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        
        setContract(contractInstance);
        setError(null);
      } catch (err) {
        console.error("Failed to initialize contract:", err);
        setError(err.message);
        setContract(null);
      } finally {
        setIsLoading(false);
      }
    };

    initContract();
  }, [contractAddress, signer, provider, isConnected]);

  return { contract, isLoading, error };
};