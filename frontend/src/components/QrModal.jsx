import React from 'react';

/**
 * QR Code Modal Component
 * Renders a dialog with QR Code preview and download actions.
 */
export default function QrModal({ isOpen, onClose, shortUrl, originalUrl, onToast }) {
  if (!isOpen) return null;

  // Use dynamic QR code image or generated SVG
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    shortUrl || 'https://tinyroute.io'
  )}&bgcolor=f8fafc&color=1e1b4b&margin=1`;

  const handleDownload = (format) => {
    // Create an anchor and trigger download
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `tinyroute-qr-${(shortUrl || 'link').split('/').pop()}.${format.toLowerCase()}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onToast) {
      onToast(`High-resolution ${format} generated for ${shortUrl}`);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shortUrl);
    }
    if (onToast) {
      onToast(`Route ${shortUrl} copied to clipboard!`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          type="button"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-1">Route QR Code</h3>
          <p className="font-mono text-xs text-slate-500 truncate max-w-[280px] mb-4">
            {shortUrl}
          </p>

          {/* QR Display Container matching Google Stitch style */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner flex flex-col items-center justify-center mb-5 w-full">
            <div className="w-52 h-52 bg-white rounded-xl border border-slate-200 p-2 shadow-sm flex items-center justify-center">
              <img
                src={qrImageUrl}
                alt={`QR code for ${shortUrl}`}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  // Fallback sample image from Google Stitch reference
                  e.target.src =
                    'https://lh3.googleusercontent.com/aida/AEtjO1XFeEe0SEVE_CY1lyibDdb2TUO1rPSL5MJV53QvJgoEth0ikJs8RD43BYVt2q8RtuSW-2J6ukCEfllNdjvrFAZbRJ0gN4lmtC-BZQxolTM8yHbZ0AArgukb_1oPy_SCgxZIXoeEMddaOjq8_-dKQVOH6Qt1cTkUa0itXW3TgARGFgrkcTPhn1d81p8_Pa2xcg4k6YB1is5PQpOLLSFnwRfXQzBR_0o80wyTGlljPPpjMzzpYhc5vAx70eMD';
                }}
              />
            </div>
            {originalUrl && (
              <span className="mt-3 text-[11px] font-mono text-slate-500 truncate max-w-[300px]">
                Target: {originalUrl}
              </span>
            )}
          </div>

          <div className="w-full grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDownload('PNG')}
              className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs transition-colors flex items-center justify-center gap-1.5 font-medium border border-slate-200"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              Download PNG
            </button>
            <button
              onClick={handleShare}
              className="py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs transition-colors flex items-center justify-center gap-1.5 font-semibold shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              Copy & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
