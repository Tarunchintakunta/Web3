import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { ethers } from 'ethers';

// We'll replace this with actual contract data later
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

const Staking = () => {
  const { isConnected, connectWallet, signer, account } = useWeb3();
  const [stakeAmount, setStakeAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [stakedInfo, setStakedInfo] = useState({
    amount: 0,
    rewards: 0,
    isActive: false
  });
  
  // This would be replaced with actual contract interaction
  const handleStake = async (e) => {
    e.preventDefault();
    if (!isConnected || !signer) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Here we would interact with the staking contract
      setSuccess(`Staked ${stakeAmount} ETH successfully!`);
      setStakeAmount('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Staking</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-2">Staking</h2>
            <p className="text-gray-600 mb-6">Stake your ETH to earn rewards</p>
            <div className="text-center py-8">
              <p className="mb-4">Connect your wallet to start staking</p>
              <button 
                onClick={connectWallet}
                className="bg-primary text-white px-4 py-2 rounded-md font-medium"
              >
                Connect your wallet to start staking
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-2">About Staking</h2>
            <p className="text-gray-600 mb-3">Learn how staking works on our platform</p>
            
            <h3 className="font-medium mt-6 mb-2">What is staking?</h3>
            <p className="text-gray-600 mb-4">
              Staking is the process of locking up crypto assets to support a blockchain network's operations. In 
              return for staking, you can earn rewards in the form of additional tokens.
            </p>
            
            <h3 className="font-medium mt-6 mb-2">How does it work?</h3>
            <p className="text-gray-600 mb-4">
              When you stake ETH on our platform, your tokens are locked in a smart contract on the Sepolia 
              testnet. The contract ensures your funds are secure while you earn rewards.
            </p>
            
            <h3 className="font-medium mt-6 mb-2">Rewards and Withdrawals</h3>
            <p className="text-gray-600 mb-4">
              You can withdraw your staked ETH at any time. Rewards are calculated based on the amount 
              staked and the duration of staking.
            </p>
            
            <div className="bg-gray-100 p-4 rounded-md mt-6">
              <p className="text-gray-600 font-medium">Note:</p>
              <p className="text-gray-600">This is a demonstration on the Sepolia testnet. The ETH used has no real-world value.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Staking</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-2">Staking</h2>
          <p className="text-gray-600 mb-6">Stake your ETH to earn rewards</p>
          
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
          
          {stakedInfo.isActive ? (
            <div>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Staked Amount:</span>
                  <span className="font-medium">{ethers.formatEther(stakedInfo.amount)} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rewards Earned:</span>
                  <span className="font-medium">{ethers.formatEther(stakedInfo.rewards)} ETH</span>
                </div>
              </div>
              
              <button
                onClick={async () => {
                  // Here we would call the withdraw function on the contract
                  alert("Withdraw functionality will be implemented with contract integration");
                }}
                className="bg-primary text-white px-4 py-2 rounded-md w-full font-medium mb-3"
              >
                Withdraw All
              </button>
              
              <button
                onClick={() => {
                  // Reset to staking form
                  setStakedInfo({ amount: 0, rewards: 0, isActive: false });
                }}
                className="bg-white text-primary border border-primary px-4 py-2 rounded-md w-full font-medium"
              >
                Stake More
              </button>
            </div>
          ) : (
            <form onSubmit={handleStake}>
              <div className="mb-6">
                <label htmlFor="stakeAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to Stake (ETH)
                </label>
                <input
                  type="number"
                  id="stakeAmount"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0.1"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md w-full font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Staking...' : 'Stake ETH'}
              </button>
            </form>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-2">About Staking</h2>
          <p className="text-gray-600 mb-3">Learn how staking works on our platform</p>
          
          <h3 className="font-medium mt-6 mb-2">What is staking?</h3>
          <p className="text-gray-600 mb-4">
            Staking is the process of locking up crypto assets to support a blockchain network's operations. In 
            return for staking, you can earn rewards in the form of additional tokens.
          </p>
          
          <h3 className="font-medium mt-6 mb-2">How does it work?</h3>
          <p className="text-gray-600 mb-4">
            When you stake ETH on our platform, your tokens are locked in a smart contract on the Sepolia 
            testnet. The contract ensures your funds are secure while you earn rewards.
          </p>
          
          <h3 className="font-medium mt-6 mb-2">Rewards and Withdrawals</h3>
          <p className="text-gray-600 mb-4">
            You can withdraw your staked ETH at any time. Rewards are calculated based on the amount 
            staked and the duration of staking.
          </p>
          
          <div className="bg-gray-100 p-4 rounded-md mt-6">
            <p className="text-gray-600 font-medium">Note:</p>
            <p className="text-gray-600">This is a demonstration on the Sepolia testnet. The ETH used has no real-world value.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staking;