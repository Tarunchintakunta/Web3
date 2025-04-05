import React from 'react';

const Footer = () => {
  return (
    <footer className="py-6 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2025 Web3 Genesis Finance. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-gray-600">
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;