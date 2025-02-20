import React from 'react';
import { UploadCloud, Move, Download , Code2Icon} from 'lucide-react';
import SteganographyService from '../services/SteganographyService';


interface SidebarProps {
  baseImage: string | null;
  overlayImage: string | null;
  handleBaseImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOverlayUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  //handleSaveImage: () => void;
  handleEncode: () => void;
  handleDecode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ baseImage, overlayImage, handleBaseImageUpload, handleOverlayUpload , handleEncode, handleDecode}) => {
  return (
    <div className="w-1/4 bg-gray-50 rounded-xl p-4 flex flex-col space-y-4">
      {/* Base Image Upload */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="baseImage" className="flex items-center justify-center space-x-2 bg-emerald-500 text-white py-2 rounded-lg cursor-pointer hover:bg-emerald-600 transition-colors">
          <UploadCloud className="w-5 h-5" />
          <span>Upload Base Image</span>
          <input
            id="baseImage"
            type="file"
            accept="image/*"
            onChange={handleBaseImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Overlay Image Upload (Only show this button if a base image is uploaded) */}
      {baseImage && (
        <div className="flex flex-col space-y-2">
          <label htmlFor="overlayImage" className="flex items-center justify-center space-x-2 bg-emerald-500 text-white py-2 rounded-lg cursor-pointer hover:bg-emerald-600 transition-colors">
            <Move className="w-5 h-5" />
            <span>Add Overlay Image</span>
            <input
              id="overlayImage"
              type="file"
              accept="image/*"
              onChange={handleOverlayUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Export Button (Only show if base image and overlay image are both uploaded) */}
      {/* {baseImage && (
        <button onClick={handleSaveImage} className="flex items-center justify-center space-x-2 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors">
          <Download className="w-5 h-5" />
          <span>Export Image</span>
        </button>
      )} */}

      {baseImage && overlayImage &&(
        <button onClick={handleEncode} className="flex items-center justify-center space-x-2 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors">
          <Code2Icon className="w-5 h-5" />
          <span>Encode Image</span>
        </button>
      )}

      
        {baseImage && (<button onClick={handleDecode} className="flex items-center justify-center space-x-2 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors">
          <Code2Icon className="w-5 h-5" />
          <span>Decode Image</span>
        </button>)}
      
    </div>
  );
};

export default Sidebar;