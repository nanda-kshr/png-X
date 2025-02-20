import React, { useState } from 'react';
import SteganographyService from '../services/SteganographyService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const SteganographyTool: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [alteredImage, setAlteredImage] = useState<File | null>(null);
  const [stegoImage, setStegoImage] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOriginalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOriginalImage(e.target.files[0]);
    }
  };

  const handleAlteredImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAlteredImage(e.target.files[0]);
    }
  };

  const handleStegoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStegoImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  

  

  const handleClearUploads = async () => {
    try {
      await SteganographyService.clearUploads();
      setOriginalImage(null);
      setAlteredImage(null);
      setStegoImage(null);
      setRestoredImage(null);
      setError(null);
    } catch (err) {
      setError('Failed to clear uploads');
      console.error(err);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Image Steganography Tool</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Encoding Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Encode</h3>
          <Input 
            type="file" 
            accept="image/png,image/jpeg" 
            onChange={handleOriginalImageUpload} 
            className="mb-2"
          />
          <Input 
            type="file" 
            accept="image/png,image/jpeg" 
            onChange={handleAlteredImageUpload} 
            className="mb-2"
          />
          <Button onClick={handleEncode} className="w-full">
            Encode Images
          </Button>
        </div>

        {/* Decoding Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Decode</h3>
          <Input 
            type="file" 
            accept="image/png,image/jpeg" 
            onChange={handleStegoImageUpload} 
            className="mb-2"
          />
          <Button onClick={handleDecode} className="w-full">
            Decode Image
          </Button>
        </div>

        {/* Results Section */}
        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-between">
          {stegoImage && (
            <div>
              <h4 className="text-md font-medium">Stego Image</h4>
              <img 
                src={stegoImage} 
                alt="Steganography Image" 
                className="max-w-[200px] max-h-[200px]" 
              />
            </div>
          )}
          
          {restoredImage && (
            <div>
              <h4 className="text-md font-medium">Restored Image</h4>
              <img 
                src={restoredImage} 
                alt="Restored Image" 
                className="max-w-[200px] max-h-[200px]" 
              />
            </div>
          )}
        </div>

        <Button 
          variant="destructive" 
          onClick={handleClearUploads} 
          className="w-full mt-4"
        >
          Clear Uploads
        </Button>
      </CardContent>
    </Card>
  );
};

export default SteganographyTool;