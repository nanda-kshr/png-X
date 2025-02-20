import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react'; // Assuming you're using lucide-react for icons
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SteganographyTool from './SteganographyTool'; // Import the steganography component

const SteganographySidebarButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => setIsOpen(true)}
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          Image Steganography
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <SteganographyTool />
      </DialogContent>
    </Dialog>
  );
};

export default SteganographySidebarButton;