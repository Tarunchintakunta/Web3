import { ethers } from 'ethers';

// This file will contain functions to interact with the smart contract

// Helper function to format ETH with 4 decimal places
export const formatEth = (value) => {
  if (!value) return '0';
  return parseFloat(ethers.formatEther(value)).toFixed(4);
};

// Get estimated gas price
export const getGasPrice = async (provider) => {
  try {
    const feeData = await provider.getFeeData();
    return feeData.gasPrice;
  } catch (error) {
    console.error('Error getting gas price:', error);
    return null;
  }
};

// We'll add more contract-specific functions here once we deploy the contract