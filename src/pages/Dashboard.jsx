import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';
import { ethers } from 'ethers';
import { HEALTH_STAKING_ADDRESS } from '../utils/contractConfig';
import HealthStakingABI from '../contracts/HealthStaking.json';

const Dashboard = () => {
  const { isConnected, connectWallet, account, provider, signer } = useWeb3();
  const [balance, setBalance] = useState("0");
  const [stakedInfo, setStakedInfo] = useState({
    amount: "0",
    isActive: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Health indicators (mock data)
  const [healthStats] = useState({
    projectsSupported: 0,
    communityImpact: 0,
    contributorsCount: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || !account || !provider) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch ETH balance
        const balanceWei = await provider.getBalance(account);
        setBalance(ethers.formatEther(balanceWei));

        // Fetch staked amount only if contract address is valid
        if (HEALTH_STAKING_ADDRESS && HEALTH_STAKING_ADDRESS !== "0x0000000000000000000000000000000000000000") {
          try {
            const contract = new ethers.Contract(
              HEALTH_STAKING_ADDRESS,
              HealthStakingABI.abi,
              signer
            );
            
            const stakeInfo = await contract.getStakeInfo(account);
            setStakedInfo({
              amount: ethers.formatEther(stakeInfo[0]),
              isActive: stakeInfo[3]
            });
          } catch (contractErr) {
            console.error("Error fetching staking info:", contractErr);
            // Continue even if contract interaction fails
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isConnected, account, provider, signer]);

  if (!isConnected) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Health Initiatives Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="flex justify-center mb-4">
            <svg 
              className="w-16 h-16 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-8">
            Connect your Ethereum wallet to access the MedChain Platform.
            <br />Support health initiatives, track your impact, and contribute to global wellness.
          </p>
          <button 
            onClick={connectWallet}
            className="bg-green-500 text-white px-6 py-3 rounded-md font-medium"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Health Initiatives Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-red-500 mb-4">
            Error loading data: {error}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Health Initiatives Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Digital Health Wallet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-gray-500 text-sm mb-1">Available ETH</h3>
            <p className="text-2xl font-medium">
              {isLoading ? "Loading..." : `${parseFloat(balance).toFixed(4)} ETH`}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-gray-500 text-sm mb-1">Health Fund Contributions</h3>
            <p className="text-2xl font-medium">
              {isLoading ? "Loading..." : `${parseFloat(stakedInfo.amount).toFixed(4)} ETH`}
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Your Health Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-md text-center">
              <p className="text-3xl font-bold text-green-600">{healthStats.projectsSupported}</p>
              <p className="text-sm text-gray-600">Health Projects Supported</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md text-center">
              <p className="text-3xl font-bold text-green-600">{healthStats.communityImpact}</p>
              <p className="text-sm text-gray-600">People Reached</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md text-center">
              <p className="text-3xl font-bold text-green-600">{healthStats.contributorsCount}</p>
              <p className="text-sm text-gray-600">Fellow Contributors</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <Link 
            to="/send"
            className="bg-green-500 text-white px-4 py-2 rounded-md font-medium"
          >
            Send ETH
          </Link>
          <Link 
            to="/staking"
            className="bg-white text-green-500 border border-green-500 px-4 py-2 rounded-md font-medium"
          >
            Fund Health Initiatives
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-semibold mb-4">Featured Health Initiatives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">Telemedicine Access Program</h3>
            <p className="text-gray-600 mb-4">
              Funding blockchain-based solutions to provide remote healthcare to underserved communities.
            </p>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span>75% Funded</span>
              <span>Target: 10 ETH</span>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">Medical Records on Blockchain</h3>
            <p className="text-gray-600 mb-4">
              Developing secure, patient-controlled health records using blockchain technology.
            </p>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="bg-green-500 h-2 rounded-full w-1/2"></div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span>50% Funded</span>
              <span>Target: 15 ETH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;