// src/utils/etherscan.js

// Get the correct Etherscan base URL based on the network
export const getEtherscanBaseUrl = (chainId) => {
    switch (chainId) {
      case 1: // Ethereum Mainnet
        return 'https://etherscan.io';
      case 11155111: // Sepolia
        return 'https://sepolia.etherscan.io';
      case 5: // Goerli
        return 'https://goerli.etherscan.io';
      case 137: // Polygon
        return 'https://polygonscan.com';
      case 80001: // Mumbai (Polygon Testnet)
        return 'https://mumbai.polygonscan.com';
      case 56: // Binance Smart Chain
        return 'https://bscscan.com';
      case 97: // Binance Smart Chain Testnet
        return 'https://testnet.bscscan.com';
      default:
        // Default to Sepolia since that's what's in your Hardhat config
        return 'https://sepolia.etherscan.io';
    }
  };
  
  // Get transaction URL on Etherscan
  export const getTransactionUrl = (txHash, chainId) => {
    const baseUrl = getEtherscanBaseUrl(chainId);
    return `${baseUrl}/tx/${txHash}`;
  };
  
  // Get address URL on Etherscan
  export const getAddressUrl = (address, chainId) => {
    const baseUrl = getEtherscanBaseUrl(chainId);
    return `${baseUrl}/address/${address}`;
  };
  
  // Get contract URL on Etherscan
  export const getContractUrl = (contractAddress, chainId) => {
    const baseUrl = getEtherscanBaseUrl(chainId);
    return `${baseUrl}/address/${contractAddress}#code`;
  };
  
  // Fetch transaction details from Etherscan API
  export const fetchTransactionDetails = async (txHash, apiKey, chainId = 11155111) => {
    const baseUrl = getEtherscanBaseUrl(chainId).replace('https://', 'https://api.');
    
    try {
      const response = await fetch(
        `${baseUrl}/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${apiKey}`
      );
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      return null;
    }
  };
  
  // Fetch address balance from Etherscan API
  export const fetchAddressBalance = async (address, apiKey, chainId = 11155111) => {
    const baseUrl = getEtherscanBaseUrl(chainId).replace('https://', 'https://api.');
    
    try {
      const response = await fetch(
        `${baseUrl}/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`
      );
      const data = await response.json();
      
      if (data.status === '1') {
        // Convert wei to ether
        const balanceInWei = data.result;
        const balanceInEth = Number(balanceInWei) / 1e18;
        return balanceInEth.toFixed(4);
      }
      return null;
    } catch (error) {
      console.error('Error fetching address balance:', error);
      return null;
    }
  };