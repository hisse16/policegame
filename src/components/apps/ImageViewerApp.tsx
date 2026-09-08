import React, { useState } from 'react';
import { vfs } from '../../services/vfs';
import { Icon } from '../common/Icon';

interface ImageViewerAppProps {
  windowId: string;
  params?: { path?: string };
}

export const ImageViewerApp: React.FC<ImageViewerAppProps> = ({ params }) => {
  const currentPath = params?.path || '/home/investigator/Pictures/crime_scene_map.svg';
  const node = vfs.getNode(currentPath);

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const handleZoomIn = () => setZoom((z) => Math.min(3, z + 0.25));
  const handleZoomOut = () => setZoom((z) => Math.max(0.25, z - 0.25));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const isSvg = node?.mimeType === 'image/svg+xml' || currentPath.endsWith('.svg');

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-none text-xs">
      {/* Top Toolbar */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Icon name="ZoomIn" className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Icon name="ZoomOut" className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRotate}
            title="Rotate 90° Clockwise"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Icon name="RotateCw" className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            title="Reset Zoom & Rotation"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-[11px]"
          >
            Reset
          </button>
          <span className="text-slate-500 font-mono ml-1 text-[11px]">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono text-[11px] truncate max-w-xs">
            {node?.name || 'Image'}
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`p-1.5 rounded transition-colors ${
              showDetails ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Details"
          >
            <Icon name="Info" className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative flex items-center justify-center overflow-auto p-4 bg-radial from-slate-900 to-slate-950">
        {!node ? (
          <div className="text-slate-500 text-center">
            <Icon name="Image" className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <span>No image loaded</span>
          </div>
        ) : isSvg ? (
          <div
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.15s ease-out'
            }}
            className="max-w-full max-h-full flex items-center justify-center select-none shadow-2xl rounded"
            dangerouslySetInnerHTML={{ __html: node.content || '' }}
          />
        ) : (
          <img
            src={node.content || ''}
            alt={node.name}
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.15s ease-out'
            }}
            className="max-w-full max-h-full object-contain shadow-2xl rounded"
          />
        )}

        {/* Side Details Overlay */}
        {showDetails && node && (
          <div className="absolute top-3 right-3 w-56 bg-slate-900/95 border border-slate-700/80 rounded-lg p-3 shadow-xl backdrop-blur-md text-xs space-y-2">
            <div className="font-semibold text-slate-100 pb-1 border-b border-slate-800">
              Image Information
            </div>
            <div className="space-y-1 font-mono text-[11px] text-slate-300">
              <div>
                <span className="text-slate-500">File:</span> {node.name}
              </div>
              <div>
                <span className="text-slate-500">Size:</span> {(node.size / 1024).toFixed(1)} KB
              </div>
              <div>
                <span className="text-slate-500">Format:</span> {node.mimeType}
              </div>
              <div>
                <span className="text-slate-500">Created:</span> {node.createdAt.substring(0, 10)}
              </div>
              <div>
                <span className="text-slate-500">Path:</span> {node.path}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="h-6 px-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
        <span>Zoom: {Math.round(zoom * 100)}%</span>
        <span>Rotation: {rotation}°</span>
        <span>{node?.mimeType || 'unknown'}</span>
      </div>
    </div>
  );
};
