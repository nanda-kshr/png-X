import React from 'react';
import { Minimize, Maximize, RefreshCcw } from 'lucide-react';

interface HeaderProps {
  handleReset: () => void;
  toggleFullScreen: () => void;
  isFullScreen: boolean;
}

const Header: React.FC<HeaderProps> = ({ handleReset, toggleFullScreen, isFullScreen }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <h2 className="text-xl font-semibold">Image Overlay Studio</h2>
      </div>
      <div className="flex items-center space-x-3">
        <button onClick={handleReset} className="hover:bg-emerald-600 p-2 rounded-full transition-colors" title="Reset">
          <RefreshCcw className="w-5 h-5" />
        </button>
        <button onClick={toggleFullScreen} className="hover:bg-emerald-600 p-2 rounded-full transition-colors" title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}>
          {isFullScreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default Header;