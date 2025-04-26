
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-cream-light py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center">
          <div className="text-coffee-dark/60 text-sm">
            © {currentYear} Kin. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
