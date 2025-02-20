import React from 'react';

const ExportButton: React.FC<{ overlayImage: string | null; baseImage: string | null }> = ({ overlayImage, baseImage }) => {
  const handleSaveImage = () => {
    // Logic to save image
  };

  return overlayImage && baseImage ? (
    <button onClick={handleSaveImage} className="export-button">
      Export Image
    </button>
  ) : null;
};

export default ExportButton;