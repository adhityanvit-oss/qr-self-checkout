import { useState } from 'react';

// This tells TypeScript what kind of data the Scanner expects
interface ScannerProps {
  onScan: (qrCode: string) => void;
}

export default function Scanner({ onScan }: ScannerProps) {
  const [manualCode, setManualCode] = useState('');

  return (
    <div className="flex flex-col items-center gap-6">
      {/* The Fake Camera Viewfinder */}
      <div className="w-64 h-64 bg-slate-900 rounded-3xl relative flex items-center justify-center overflow-hidden shadow-inner">
        {/* Viewfinder borders */}
        <div className="absolute inset-6 border-2 border-blue-500/30 rounded-2xl"></div>
        {/* Animated laser scan line */}
        <div className="w-full h-[2px] bg-blue-400 absolute top-1/2 shadow-[0_0_15px_#60a5fa] animate-pulse"></div>
        <p className="text-slate-400 text-sm z-10 font-medium tracking-widest uppercase">Point at QR</p>
      </div>

      {/* Manual testing inputs */}
      <div className="w-full flex flex-col gap-3 mt-4">
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider text-center">Testing Controls</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type QR (e.g., qr-12345)"
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
          />
          <button
            onClick={() => onScan(manualCode || 'qr-12345')}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            Simulate
          </button>
        </div>
      </div>
    </div>
  );
}