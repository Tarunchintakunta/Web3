import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { ethers } from 'ethers';

const Send = () => {
  const { isConnected, connectWallet, account, signer } = useWeb3();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('Medical Equipment Donation');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const purposes = [
    "Medical Equipment Donation",
    "Patient Treatment Fund",
    "Healthcare Provider Payment",
    "Medical Research Contribution",
    "Health Insurance Premium",
    "Other Health Purpose"
  ];
  
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
      
      setSuccess(`Transaction sent! Purpose: ${purpose}. Hash: ${tx.hash}`);
      setRecipient('');
      setAmount('');
      setPurpose('Medical Equipment Donation');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Health Payments</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-2">Send ETH for Health Services</h2>
            <p className="text-gray-600 mb-6">Make healthcare payments or donations securely on the blockchain</p>
            <div className="text-center py-8">
              <p className="mb-4">Connect your wallet to make health payments</p>
              <button 
                onClick={connectWallet}
                className="bg-green-500 text-white px-4 py-2 rounded-md font-medium"
              >
                Connect your wallet
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-2">Receive Health Payments</h2>
            <p className="text-gray-600 mb-6">Share your address to receive payments for health services</p>
            <div className="text-center py-8">
              <p className="mb-4">Connect your wallet to receive payments</p>
              <button 
                onClick={connectWallet}
                className="bg-green-500 text-white px-4 py-2 rounded-md font-medium"
              >
                Connect your wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Health Payments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-2">Send ETH for Health Services</h2>
          <p className="text-gray-600 mb-6">Make healthcare payments or donations securely on the blockchain</p>
          
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
            
            <div className="mb-4">
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
            
            <div className="mb-6">
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Purpose
              </label>
              <select
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                {purposes.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md w-full font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Send Health Payment'}
            </button>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-2">Receive Health Payments</h2>
          <p className="text-gray-600 mb-6">Share your address to receive payments for health services</p>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4 break-all">
            <p className="font-mono text-sm">{account}</p>
          </div>
          
          <button
            onClick={() => {
              navigator.clipboard.writeText(account);
              alert('Address copied to clipboard!');
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-md w-full font-medium mb-4"
          >
            Copy Address
          </button>
          
          <div className="mt-6 border-t pt-6">
            <h3 className="font-medium mb-2">Payment Categories</h3>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded mr-2 mt-1">Medical</span>
                <span>Accept payments for medical consultations, treatments, or procedures</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded mr-2 mt-1">Research</span>
                <span>Receive funding for healthcare research and development</span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded mr-2 mt-1">Donation</span>
                <span>Accept charitable donations for health initiatives</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Send;