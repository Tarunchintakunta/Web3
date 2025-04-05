import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { ethers } from 'ethers';
import { HEALTH_STAKING_ADDRESS } from '../utils/contractConfig';
import HealthStakingABI from '../contracts/HealthStaking.json';

const Staking = () => {
  const { isConnected, connectWallet, account, signer } = useWeb3();
  const [fundAmount, setFundAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [contract, setContract] = useState(null);
  
  const [fundingInfo, setFundingInfo] = useState({
    amount: "0",
    timestamp: "0",
    rewards: "0",
    isActive: false
  });
  
  // Initialize contract
  useEffect(() => {
    if (signer && HEALTH_STAKING_ADDRESS !== "0x0000000000000000000000000000000000000000") {
      const healthContract = new ethers.Contract(
        HEALTH_STAKING_ADDRESS,
        HealthStakingABI.abi,
        signer
      );
      setContract(healthContract);
    }
  }, [signer]);
  
  // Fetch funding info
  useEffect(() => {
    const fetchFundingInfo = async () => {
      if (!contract || !account) return;
      
      try {
        const info = await contract.getStakeInfo(account);
        setFundingInfo({
          amount: info[0].toString(),
          timestamp: info[1].toString(),
          rewards: info[2].toString(),
          isActive: info[3]
        });
      } catch (err) {
        console.error("Error fetching funding info:", err);
      }
    };
    
    if (isConnected && contract) {
      fetchFundingInfo();
    }
  }, [isConnected, contract, account]);
  
  // Handle funding
  const handleFund = async (e) => {
    e.preventDefault();
    if (!contract) {
      setError("Contract not initialized");
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const amountToFund = ethers.parseEther(fundAmount);
      
      // Call the stake function on the contract
      const tx = await contract.stake({ value: amountToFund });
      await tx.wait();
      
      setSuccess(`Successfully funded ${fundAmount} ETH to health initiatives!`);
      setFundAmount('');
      
      // Refresh funding info
      const info = await contract.getStakeInfo(account);
      setFundingInfo({
        amount: info[0].toString(),
        timestamp: info[1].toString(),
        rewards: info[2].toString(),
        isActive: info[3]
      });
    } catch (err) {
      setError(err.message || "Failed to fund ETH");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle withdrawal
  const handleWithdraw = async () => {
    if (!contract) {
      setError("Contract not initialized");
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const tx = await contract.withdraw();
      await tx.wait();
      
      setSuccess("Successfully withdrawn funds and impact rewards!");
      
      // Refresh funding info
      const info = await contract.getStakeInfo(account);
      setFundingInfo({
        amount: info[0].toString(),
        timestamp: info[1].toString(),
        rewards: info[2].toString(),
        isActive: info[3]
      });
    } catch (err) {
      setError(err.message || "Failed to withdraw ETH");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Health Initiative Funding</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-2">Fund Health Initiatives</h2>
            <p className="text-gray-600 mb-6">Contribute ETH to support global health initiatives and earn impact rewards</p>
            <div className="text-center py-8">
              <p className="mb-4">Connect your wallet to start contributing</p>
              <button 
                onClick={connectWallet}
                className="bg-green-500 text-white px-4 py-2 rounded-md font-medium"
              >
                Connect your wallet
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-2">About Health Funding</h2>
            <p className="text-gray-600 mb-3">Learn how blockchain funding improves healthcare access</p>
            
            <h3 className="font-medium mt-6 mb-2">What is health initiative funding?</h3>
            <p className="text-gray-600 mb-4">
              Health initiative funding is a blockchain-based way to support healthcare projects globally. Your ETH is used to 
              develop and deploy healthcare solutions in underserved regions while earning impact rewards.
            </p>
            
            <h3 className="font-medium mt-6 mb-2">How does it work?</h3>
            <p className="text-gray-600 mb-4">
              When you contribute ETH on our platform, your funds are locked in a smart contract on the Sepolia 
              testnet. These funds are allocated to health projects, and you earn rewards for your contribution.
            </p>
            
            <h3 className="font-medium mt-6 mb-2">Rewards and Impact</h3>
            <p className="text-gray-600 mb-4">
              You receive impact rewards based on the duration and amount of your contribution. These rewards represent the social impact
              of your contribution to global health initiatives.
            </p>
            
            <div className="bg-gray-100 p-4 rounded-md mt-6">
              <p className="text-gray-600 font-medium">Note:</p>
              <p className="text-gray-600">This is a demonstration on the Sepolia testnet. The ETH used has no real-world value, but represents how real health funding would work.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Health Initiative Funding</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-2">Fund Health Initiatives</h2>
          <p className="text-gray-600 mb-6">Contribute ETH to support global health initiatives and earn impact rewards</p>
          
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
          
          {fundingInfo.isActive ? (
            <div>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Current Contribution:</span>
                  <span className="font-medium">{ethers.formatEther(fundingInfo.amount)} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impact Rewards Earned:</span>
                  <span className="font-medium">{ethers.formatEther(fundingInfo.rewards)} ETH</span>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Your contribution is supporting telemedicine access in rural communities and secure medical records initiatives.
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleWithdraw}
                className="bg-green-500 text-white px-4 py-2 rounded-md w-full font-medium mb-3"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Withdraw Funds & Rewards'}
              </button>
              
              <button
                onClick={() => {
                  setFundingInfo({ ...fundingInfo, isActive: false });
                }}
                className="bg-white text-green-500 border border-green-500 px-4 py-2 rounded-md w-full font-medium"
              >
                Contribute More
              </button>
            </div>
          ) : (
            <form onSubmit={handleFund}>
              <div className="mb-6">
                <label htmlFor="fundAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Contribution Amount (ETH)
                </label>
                <input
                  type="number"
                  id="fundAmount"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0.1"
                  step="0.01"
                  min="0"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  100% of your contribution goes to health initiatives
                </p>
              </div>
              
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md w-full font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Fund Health Initiatives'}
              </button>
            </form>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-2">Current Health Initiatives</h2>
          
          <div className="mb-6 border-b pb-4">
            <h3 className="font-medium text-lg mb-2">Telemedicine Access Program</h3>
            <p className="text-gray-600 mb-4">
              Using blockchain to verify healthcare providers and connect patients in rural areas with specialists.
            </p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>7.5 ETH raised</span>
              <span>75% complete</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
              <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
            </div>
          </div>
          
          <div className="mb-6 border-b pb-4">
            <h3 className="font-medium text-lg mb-2">Medical Records on Blockchain</h3>
            <p className="text-gray-600 mb-4">
              Creating secure, patient-controlled health records using blockchain to ensure privacy and accessibility.
            </p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>5 ETH raised</span>
              <span>50% complete</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
              <div className="bg-green-500 h-2 rounded-full w-1/2"></div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Pharmaceutical Supply Chain</h3>
            <p className="text-gray-600 mb-4">
              Tracking medications from manufacturer to patient to eliminate counterfeit drugs and ensure quality.
            </p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>2 ETH raised</span>
              <span>20% complete</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
              <div className="bg-green-500 h-2 rounded-full w-1/5"></div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-sm text-gray-700">
              <strong>Impact Metrics:</strong> So far, our platform has helped provide healthcare access to 1,200+ people in underserved communities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staking;