import React, { useEffect, useRef } from 'react';

const CoffeeLogoExport = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set text properties
        ctx.font = '500 48px serif';
        ctx.fillStyle = '#6F4E37';
        
        // Draw Kin text
        ctx.fillText('Kin', 50, 100);

        // Export to PNG
        const dataURL = canvas.toDataURL('image/png');
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = 'kin-logo.png';
        downloadLink.innerText = 'Download PNG';
        downloadLink.className = 'mt-4 inline-block bg-coffee-dark text-white px-4 py-2 rounded-md hover:bg-coffee-dark/90 transition-colors';
        
        // Add link to DOM
        const container = canvas.parentElement;
        if (container) {
          // Remove any existing download links
          const existingLink = container.querySelector('a');
          if (existingLink) {
            container.removeChild(existingLink);
          }
          container.appendChild(downloadLink);
        }
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center mt-8 p-4 border rounded-lg">
      <h2 className="text-xl font-serif mb-4">Kin Logo Export</h2>
      <div className="mb-4">
        <div className="w-[100px] h-[100px] flex items-center justify-center">
          <span className="font-serif text-5xl font-medium text-coffee-dark">Kin</span>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        width={200} 
        height={200} 
        className="border rounded-md"
      ></canvas>
      <div className="mt-4 flex gap-4">
        <a 
          href="/coffee-logo.svg" 
          download 
          className="bg-coffee-dark text-white px-4 py-2 rounded-md hover:bg-coffee-dark/90 transition-colors"
        >
          Download SVG
        </a>
      </div>
    </div>
  );
};

export default CoffeeLogoExport;
