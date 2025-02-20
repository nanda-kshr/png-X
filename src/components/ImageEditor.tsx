import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import CanvasArea from './Canvas';
import ExportButton from './ExportButton';

//import { BaseImageUploader, OverlayImageUploader, Sidebar, Header, ExportButton } from '.';

const ImageEditor: React.FC = () => {
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [overlayDimensions, setOverlayDimensions] = useState({ width: 0, height: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="image-editor-container">
      <Header />
      <div className="flex-grow flex p-4 space-x-4 overflow-hidden">
        <Sidebar 
          onBaseImageUpload={setBaseImage}
          onOverlayImageUpload={setOverlayImage} 
          baseImage={baseImage}
        />
        <CanvasArea 
          baseImage={baseImage}
          overlayImage={overlayImage}
          overlayPosition={overlayPosition}
          setOverlayPosition={setOverlayPosition}
          canvasSize={canvasSize}
          overlayDimensions={overlayDimensions}
        />
      </div>
      <ExportButton overlayImage={overlayImage} baseImage={baseImage} />
    </div>
  );
};

export default ImageEditor;