import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { ethers } from 'ethers';

const Send = () => {
  const { isConnected, connectWallet, account, signer } = useWeb3();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleSend = async (e) => {
    e.preventDefault();
    if (!isConnected || !signer) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate recipient address
      if (!ethers.isAddress(recipient)) {
        throw new Error('Invalid recipient address');
      }
      
      // Validate amount
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }
      
      // Convert amount to wei
      const amountWei = ethers.parseEther(amount);
      
      // Send transaction
      const tx = await signer.sendTransaction({
        to: recipient,
        value: amountWei
      });
      
      setSuccess(`Transaction sent! Hash: ${tx.hash}`);
      setRecipient('');
      setAmount('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Send & Receive</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-2">Send ETH</h2>
            <p className="text-gray-600 mb-6">Send ETH to another wallet</p>
            <div className="text-center py-8">
              <p className="mb-4">Connect your wallet to send ETH</p>
              <button 
                onClick={connectWallet}
                className="bg-primary text-white px-4 py-2 rounded-md font-medium"
              >
                Connect your wallet to send ETH
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-2">Receive ETH</h2>
            <p className="text-gray-600 mb-6">Share your address to receive ETH</p>
            <div className="text-center py-8">
              <p className="mb-4">Connect your wallet to receive ETH</p>
              <button 
                onClick={connectWallet}
                className="bg-primary text-white px-4 py-2 rounded-md font-medium"
              >
                Connect your wallet to receive ETH
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Send & Receive</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-2">Send ETH</h2>
          <p className="text-gray-600 mb-6">Send ETH to another wallet</p>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSend}>
            <div className="mb-4">
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Address
              </label>
              <input
                type="text"
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="0x..."
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (ETH)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="0.01"
                step="0.0001"
                min="0"
                required
              />
            </div>
            
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md w-full font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send ETH'}
            </button>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-2">Receive ETH</h2>
          <p className="text-gray-600 mb-6">Share your address to receive ETH</p>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4 break-all">
            <p className="font-mono text-sm">{account}</p>
          </div>
          
          <button
            onClick={() => {
              navigator.clipboard.writeText(account);
              alert('Address copied to clipboard!');
            }}
            className="bg-primary text-white px-4 py-2 rounded-md w-full font-medium"
          >
            Copy Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default Send;