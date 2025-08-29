
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500">
        EchoVerse
      </h1>
      <p className="mt-2 text-lg text-slate-400">
        Your Personal AI-Powered Audiobook Creation Studio
      </p>
    </header>
  );
};

export default Header;
