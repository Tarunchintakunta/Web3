// src/services/etherscanService.js
import { getEtherscanBaseUrl } from '../utils/etherscan';

class EtherscanService {
  constructor() {
    this.apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
    this.defaultChainId = parseInt(process.env.REACT_APP_DEFAULT_CHAIN_ID || '11155111');
  }

  // Get API URL for a specific chain
  getApiUrl(chainId = this.defaultChainId) {
    const baseUrl = getEtherscanBaseUrl(chainId);
    return baseUrl.replace('https://', 'https://api.');
  }
  
  // Get transaction details
  async getTransactionDetails(txHash, chainId = this.defaultChainId) {
    try {
      const apiUrl = this.getApiUrl(chainId);
      const response = await fetch(
        `${apiUrl}/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${this.apiKey}`
      );
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      throw error;
    }
  }
  
  // Get transaction receipt
  async getTransactionReceipt(txHash, chainId = this.defaultChainId) {
    try {
      const apiUrl = this.getApiUrl(chainId);
      const response = await fetch(
        `${apiUrl}/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${this.apiKey}`
      );
      
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching transaction receipt:', error);
      throw error;
    }
  }
  
  // Get address balance
  async getAddressBalance(address, chainId = this.defaultChainId) {
    try {
      const apiUrl = this.getApiUrl(chainId);
      const response = await fetch(
        `${apiUrl}/api?module=account&action=balance&address=${address}&tag=latest&apikey=${this.apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === '1') {
        // Convert wei to ether
        const balanceInWei = data.result;
        const balanceInEth = Number(balanceInWei) / 1e18;
        return balanceInEth.toFixed(4);
      }
      
      throw new Error(data.message || 'Failed to get balance');
    } catch (error) {
      console.error('Error fetching address balance:', error);
      throw error;
    }
  }
  
  // Get token balance (ERC20)
  async getTokenBalance(address, tokenAddress, chainId = this.defaultChainId) {
    try {
      const apiUrl = this.getApiUrl(chainId);
      const response = await fetch(
        `${apiUrl}/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${address}&tag=latest&apikey=${this.apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === '1') {
        return data.result;
      }
      
      throw new Error(data.message || 'Failed to get token balance');
    } catch (error) {
      console.error('Error fetching token balance:', error);
      throw error;
    }
  }
  
  // Get a contract's ABI
  async getContractABI(contractAddress, chainId = this.defaultChainId) {
    try {
      const apiUrl = this.getApiUrl(chainId);
      const response = await fetch(
        `${apiUrl}/api?module=contract&action=getabi&address=${contractAddress}&apikey=${this.apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === '1') {
        return JSON.parse(data.result);
      }
      
      throw new Error(data.message || 'Failed to get contract ABI');
    } catch (error) {
      console.error('Error fetching contract ABI:', error);
      throw error;
    }
  }
  
  // Get gas price
  async getGasPrice(chainId = this.defaultChainId) {
    try {
      const apiUrl = this.getApiUrl(chainId);
      const response = await fetch(
        `${apiUrl}/api?module=proxy&action=eth_gasPrice&apikey=${this.apiKey}`
      );
      
      const data = await response.json();
      
      if (data.result) {
        // Convert hex to decimal
        const gasPriceWei = parseInt(data.result, 16);
        // Convert wei to gwei
        const gasPriceGwei = gasPriceWei / 1e9;
        return gasPriceGwei.toFixed(2);
      }
      
      throw new Error('Failed to get gas price');
    } catch (error) {
      console.error('Error fetching gas price:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const etherscanService = new EtherscanService();
export default etherscanService;