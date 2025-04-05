import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';

const Dashboard = () => {
  const { isConnected, connectWallet } = useWeb3();
  
  // Wallet not connected view
  if (!isConnected) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="flex justify-center mb-4">
            <svg 
              className="w-16 h-16 text-primary" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-2.5l-2.4-1.79A3 3 0 0016.73 2H7.27a3 3 0 00-1.37.21L3.5 4H4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-8">
            Connect your Ethereum wallet to access the Web3 Genesis Platform.
            <br />View your balance, send transactions, and stake tokens.
          </p>
          <button 
            onClick={connectWallet}
            className="bg-primary text-white px-6 py-3 rounded-md font-medium"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }
  
  // Connected wallet view would show balance and transaction history
  // This will be implemented when we have contract integration
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-semibold mb-4">Your Wallet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-gray-500 text-sm mb-1">ETH Balance</h3>
            <p className="text-2xl font-medium">Loading...</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-gray-500 text-sm mb-1">Staked ETH</h3>
            <p className="text-2xl font-medium">Loading...</p>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
          <div className="text-center py-8 text-gray-500">
            <p>No transactions yet</p>
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <Link 
            to="/send"
            className="bg-primary text-white px-4 py-2 rounded-md font-medium"
          >
            Send ETH
          </Link>
          <Link 
            to="/staking"
            className="bg-white text-primary border border-primary px-4 py-2 rounded-md font-medium"
          >
            Stake ETH
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;