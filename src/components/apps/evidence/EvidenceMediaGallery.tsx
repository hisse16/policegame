import React, { useState } from 'react';
import { Icon } from '../../common/Icon';
import { EvidencePhoto } from '../../../types/police';

interface EvidenceMediaGalleryProps {
  photos: EvidencePhoto[];
  evidenceTitle: string;
}

export const EvidenceMediaGallery: React.FC<EvidenceMediaGalleryProps> = ({ photos, evidenceTitle }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLightroomModal, setIsLightroomModal] = useState(false);

  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 border border-dashed border-slate-800 rounded-xl text-center">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-2">
          <Icon name="CameraOff" className="w-5 h-5" />
        </div>
        <p className="text-xs text-slate-400 font-mono">NO CRIME SCENE PHOTOGRAPHS CATALOGED</p>
        <p className="text-[11px] text-slate-600 mt-1 max-w-xs">
          Physical evidence was cataloged without wet-plate or 35mm negative attachments in the original 1998 docket.
        </p>
      </div>
    );
  }

  const currentPhoto = photos[selectedIndex] || photos[0];

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Inspector */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative shadow-inner">
        {/* Top Control Bar */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-10 relative">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-slate-200">
              FRAME {selectedIndex + 1} OF {photos.length}: {currentPhoto.title}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Icon name="ZoomOut" className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-400 px-1">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Icon name="ZoomIn" className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRotate}
              title="Rotate 90°"
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Icon name="RotateCw" className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              title="Reset View"
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Icon name="RefreshCw" className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-slate-800 mx-1" />
            <button
              onClick={() => setIsLightroomModal(true)}
              title="Enlarge Forensic View"
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
            >
              <Icon name="Maximize2" className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Viewport */}
        <div className="h-72 sm:h-80 w-full overflow-hidden flex items-center justify-center p-4 bg-slate-950/80 select-none cursor-grab active:cursor-grabbing relative">
          <div
            className="transition-transform duration-100 ease-out flex items-center justify-center max-w-full max-h-full"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`
            }}
          >
            {currentPhoto.url.startsWith('data:image/svg+xml') || currentPhoto.url.startsWith('data:') ? (
              <img
                src={currentPhoto.url}
                alt={currentPhoto.title}
                className="max-w-full max-h-64 object-contain shadow-2xl rounded border border-slate-700/50"
              />
            ) : (
              <div className="w-80 h-60 bg-slate-900 border border-slate-700 rounded flex flex-col items-center justify-center p-4 text-center">
                <Icon name="FileImage" className="w-12 h-12 text-blue-400/60 mb-2" />
                <span className="text-xs font-mono text-slate-300 font-semibold">{currentPhoto.title}</span>
                <span className="text-[10px] text-slate-500 mt-1">{currentPhoto.description}</span>
              </div>
            )}
          </div>

          {/* Photographic Watermark overlay */}
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-3 pointer-events-none">
            {currentPhoto.azimuthAngle && (
              <span>
                <strong className="text-slate-400">ANGLE:</strong> {currentPhoto.azimuthAngle}
              </span>
            )}
            {currentPhoto.photographerBadge && (
              <span>
                <strong className="text-slate-400">OFFICER:</strong> {currentPhoto.photographerBadge}
              </span>
            )}
            {currentPhoto.timestamp && (
              <span>
                <strong className="text-slate-400">CAPTURED:</strong> {currentPhoto.timestamp}
              </span>
            )}
          </div>
        </div>

        {/* Caption bar */}
        <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 text-xs">
          <p className="text-slate-300 font-medium font-mono">{currentPhoto.title}</p>
          <p className="text-slate-400 text-[11px] mt-0.5">{currentPhoto.description}</p>
        </div>
      </div>

      {/* Filmstrip thumbnails */}
      {photos.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => {
                setSelectedIndex(index);
                handleReset();
              }}
              className={`flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden border p-1 transition-all ${
                selectedIndex === index
                  ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500'
                  : 'border-slate-800 bg-slate-900/60 opacity-60 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              <div className="w-full h-12 bg-slate-950 rounded flex items-center justify-center overflow-hidden">
                <img src={photo.url} alt={photo.title} className="w-full h-full object-contain" />
              </div>
              <p className="text-[10px] font-mono text-slate-300 truncate mt-1 text-left px-0.5">
                {photo.title}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Examination Modal */}
      {isLightroomModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-semibold font-mono text-slate-100">{currentPhoto.title}</h4>
              <p className="text-xs text-slate-400 font-mono">
                {evidenceTitle} // {currentPhoto.timestamp || 'Archive Frame'}
              </p>
            </div>
            <button
              onClick={() => setIsLightroomModal(false)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              <Icon name="X" className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.title}
              className="max-h-full max-w-full object-contain rounded border border-slate-800 shadow-2xl"
            />
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
            <span>{currentPhoto.description}</span>
            <span>PHOTOGRAPHER: {currentPhoto.photographerBadge || 'Crime Scene Unit #12'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
