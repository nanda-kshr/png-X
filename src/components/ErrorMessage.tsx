import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 shadow-lg">
        <AlertTriangle className="text-red-500 w-6 h-6" />
        <div className="flex-grow">
          <p className="text-red-800 font-medium">{message}</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="text-red-500 hover:bg-red-100 rounded-full p-1 transition-colors"
            aria-label="Close error message"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;