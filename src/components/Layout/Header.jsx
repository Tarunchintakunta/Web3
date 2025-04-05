import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../../hooks/useWeb3';

const Header = () => {
  const { isConnected, connectWallet, account } = useWeb3();
  const location = useLocation();

  // Shorten wallet address for display
  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="bg-primary text-white font-bold py-1 px-3 rounded">
            W3G
          </Link>
          <span className="text-gray-800 font-medium">Finance</span>
          
          <nav className="hidden md:flex space-x-6 ml-6">
            <Link 
              to="/" 
              className={`text-gray-700 hover:text-primary ${location.pathname === '/' ? 'font-medium' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/send" 
              className={`text-gray-700 hover:text-primary ${location.pathname === '/send' ? 'font-medium' : ''}`}
            >
              Send
            </Link>
            <Link 
              to="/staking" 
              className={`text-gray-700 hover:text-primary ${location.pathname === '/staking' ? 'font-medium' : ''}`}
            >
              Staking
            </Link>
          </nav>
        </div>
        
        <button
          onClick={connectWallet}
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          {isConnected ? shortenAddress(account) : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );
};

export default Header;