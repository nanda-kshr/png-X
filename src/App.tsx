import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Move, Layers, Download, Maximize, Minimize, RefreshCcw } from 'lucide-react';
import Canvas from './components/Canvas';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SteganographyService from './services/SteganographyService';
import ErrorMessage from './components/ErrorMessage';

const App: React.FC = () => {
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [overlayPosition, setOverlayPosition] = useState({ x:10, y: 10 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [overlayDimensions, setOverlayDimensions] = useState({ width: 0, height: 0 });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stegoImage, setStegoImage] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [finalOutputFile, setFinalOutputFile] = useState<File | null>(null);

  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseInputRef = useRef<HTMLInputElement>(null);
  const overlayInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload for base image
  const handleBaseImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleReset();
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setCanvasSize({ width: img.width, height: img.height });
          setBaseImage(event.target?.result as string);
          setOverlayPosition({ x: 0, y: 0 });
          setOverlayDimensions({ width: img.width * 0.2, height: img.height * 0.2 });
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => {
        setError("Failed to upload base image. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file upload for overlay image
  const handleOverlayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const overlayImg = new Image();
        overlayImg.onload = () => {
          const maxOverlayWidth = canvasSize.width * 0.4;
          const scaleFactor = maxOverlayWidth / overlayImg.width;
          setOverlayDimensions({
            width: overlayImg.width * scaleFactor,
            height: overlayImg.height * scaleFactor
          });
        };
        overlayImg.src = event.target?.result as string;
        setOverlayImage(event.target?.result as string);
        setOverlayPosition({ x: 0, y: 0 });
      };
      reader.onerror = () => {
        setError("Failed to upload overlay image. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset all states
  const handleReset = () => {
    setBaseImage(null);
    setOverlayImage(null);
    setStegoImage(null);
    setRestoredImage(null);
    setFinalOutputFile(null);
    setOverlayPosition({ x: 0, y: 0 });
    setCanvasSize({ width: 0, height: 0 });
    setOverlayDimensions({ width: 0, height: 0 });
    setError(null);
    setIsFullScreen(false);
    if (baseInputRef.current) baseInputRef.current.value = '';
    if (overlayInputRef.current) overlayInputRef.current.value = '';
  };

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  // Handle encoding
  const handleEncode = async () => {
    if (!baseImage || !overlayImage) {
      setError('Please upload both base and overlay images.');
      return;
    }

    try {
      const saveImagePromise = new Promise<File | null>((resolve) => {
        const canvas = canvasRef.current;
        if (canvas) {
          const offscreenCanvas = document.createElement('canvas');
          const offscreenContext = offscreenCanvas.getContext('2d');

          if (offscreenContext && baseImage) {
            const baseImg = new Image();
            baseImg.onload = () => {
              offscreenCanvas.width = baseImg.width;
              offscreenCanvas.height = baseImg.height;
              offscreenContext.drawImage(baseImg, 0, 0);

              if (overlayImage) {
                const overlayImg = new Image();
                overlayImg.onload = () => {
                  offscreenContext.drawImage(overlayImg, overlayPosition.x, overlayPosition.y, overlayDimensions.width, overlayDimensions.height);
                  offscreenCanvas.toBlob((blob) => {
                    if (blob) {
                      const finalOutputFile = new File([blob], 'final-overlay-image.png', { type: 'image/png' });
                      resolve(finalOutputFile);
                    } else {
                      resolve(null);
                    }
                  }, 'image/png');
                };
                overlayImg.src = overlayImage;
              } else {
                resolve(null);
              }
            };
            baseImg.src = baseImage;
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });

      const finalOutputFile = await saveImagePromise;

      const baseImageFile = dataURItoFile(baseImage, 'base_image.png');
      const overlayImageFile = finalOutputFile || dataURItoFile(overlayImage, 'overlay_image.png');

      const result = await SteganographyService.encodeImage(baseImageFile, overlayImageFile);

      const stegoBlob = await SteganographyService.downloadFile(result.stego_image);
      setStegoImage(URL.createObjectURL(stegoBlob));
      downlaodBlob(stegoBlob, "encoded_image_pngx.png");
      setError(null);

    } catch (err) {
      setError('Failed to encode image. Please try again.');
      console.error(err);
    }
  };

  // Download the generated image from Blob
  const downlaodBlob = (stegoBlob: Blob, fname: string) => {
    const blobUrl = URL.createObjectURL(stegoBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fname;
    link.click();
    URL.revokeObjectURL(blobUrl);
  };

  // Handle decoding
  const handleDecode = async () => {
    if (!baseImage) {
      setError('Please upload a steganography image.');
      return;
    }
    const stegoImage = dataURItoFile(baseImage, 'base_image.png');
    try {
      const result = await SteganographyService.decodeImage(stegoImage);
      const restoredBlob = await SteganographyService.downloadFile(result.restored_image);
      setRestoredImage(URL.createObjectURL(restoredBlob));
      downlaodBlob(restoredBlob, "decoded_image_pngx.png");
      setError(null);
    } catch (err) {
      setError('Some error occurred. Please upload the correct image or try refreshing.');
      console.error(err);
    }
  };

  // Utility function to convert Data URI to a File object
  const dataURItoFile = (dataURI: string, filename: string): File => {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    return new File([uint8Array], filename, { type: 'image/png' });
  };

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-[#f5f7fa] via-[#c3cfe2] to-[#f5f7fa] flex items-center justify-center p-4 transition-all duration-300 ${isFullScreen ? 'z-50' : 'z-10'}`}>
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ${isFullScreen ? 'w-full h-full max-w-full max-h-full' : 'w-[90%] h-[90%] max-w-[1200px] max-h-[800px]'} flex flex-col`}>
        <Header handleReset={handleReset} toggleFullScreen={toggleFullScreen} isFullScreen={isFullScreen} />
        {error && (
          <ErrorMessage 
            message={error} 
            onClose={() => setError(null)} 
          />
        )}
        <div className="flex-grow flex p-4 space-x-4 overflow-hidden">
          <Sidebar baseImage={baseImage} overlayImage={overlayImage} handleBaseImageUpload={handleBaseImageUpload} handleOverlayUpload={handleOverlayUpload} handleEncode={handleEncode} handleDecode={handleDecode}/>
          <Canvas ref={canvasRef} baseImage={baseImage} overlayImage={overlayImage} overlayPosition={overlayPosition} overlayDimensions={overlayDimensions} setOverlayPosition={setOverlayPosition} canvasSize={canvasSize} />
        </div>
      </div>
    </div>
  );
};

export default App;