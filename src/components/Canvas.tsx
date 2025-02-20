import React, { useEffect, useRef, useState } from 'react';

interface CanvasProps {
  baseImage: string | null;
  overlayImage: string | null;
  overlayPosition: { x: number; y: number };
  overlayDimensions: { width: number; height: number };
  setOverlayPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  canvasSize: { width: number; height: number };
}

const Canvas = React.forwardRef<HTMLCanvasElement, CanvasProps>(({
  baseImage,
  overlayImage,
  overlayPosition,
  overlayDimensions,
  setOverlayPosition,
  canvasSize
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw base image
    const baseImg = new Image();
    if (!baseImage) {
      ctx.fillStyle = '#ffffff';  // White background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (baseImage) {
      baseImg.onload = () => {
        // Set canvas dimensions to base image size
        canvas.width = baseImg.width;
        canvas.height = baseImg.height;

        // Clear canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height); 

        // Draw base image
        ctx.drawImage(baseImg, 0, 0);

        // Draw overlay image with its original dimensions
        if (overlayImage) {
          const overlayImg = new Image();
          overlayImg.onload = () => {
            // Draw overlay image at original size (no resizing)
            ctx.drawImage(
              overlayImg,
              overlayPosition.x,
              overlayPosition.y,
              overlayDimensions.width,
              overlayDimensions.height
            );

            // Add dotted border for visual purposes only
            ctx.setLineDash([5, 5]); // Dotted line style
            ctx.strokeStyle = 'red'; // Border color
            ctx.lineWidth = 2; // Border width
            ctx.strokeRect(
              overlayPosition.x,
              overlayPosition.y,
              overlayDimensions.width,
              overlayDimensions.height
            );
            ctx.setLineDash([]); // Reset the line dash pattern (solid line)
          };
          overlayImg.src = overlayImage;
        }
      };
      baseImg.src = baseImage;
    }
  }, [baseImage, overlayImage, overlayPosition, overlayDimensions]);

  const startDrag = (e: React.MouseEvent) => {
    if (overlayImage) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        dragOffset.current = {
          x: e.clientX - (overlayPosition.x + rect.left),
          y: e.clientY - (overlayPosition.y + rect.top)
        };
        isDragging.current = true;
      }
    }
  };

  const dragMove = (e: React.MouseEvent) => {
    if (isDragging.current && overlayImage) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - dragOffset.current.x) ;
        const y = (e.clientY - rect.top - dragOffset.current.y) ;

        setOverlayPosition({ x, y });
      }
    }
  };

  const endDrag = () => {
    isDragging.current = false;
  };

  return (
    <>
    <canvas
      ref={(node) => {
        if (ref) {
          // Forward the ref to the canvas DOM element
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
        canvasRef.current = node!;
      }}
      width={canvasSize.width}
      height={canvasSize.height}
      style={{
        border: '2px solid black', // Border around the canvas
        cursor: 'move',
        display: 'block',
        margin: '0 auto',
        backgroundColor: '#fff',
      }}
      onMouseDown={startDrag}
      onMouseMove={dragMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      
    />
   
    </>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;