import React from 'react';
import { X, Download, ZoomIn } from 'lucide-react';
import { useStore } from '../../lib/store';

export const MediaLightbox: React.FC = () => {
  const { previewImage, setPreviewImage } = useStore();

  if (!previewImage) return null;

  return (
    <div
      onClick={() => setPreviewImage(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
        {/* Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <a
            href={previewImage}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg bg-[#121215]/80 border border-[#2E2E35] text-white hover:bg-[#1C1C21] transition-colors shadow-lg"
            title="Open Original"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={() => setPreviewImage(null)}
            className="p-2 rounded-lg bg-[#121215]/80 border border-[#2E2E35] text-white hover:bg-[#1C1C21] transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <img
          src={previewImage}
          alt="Preview"
          onClick={(e) => e.stopPropagation()}
          className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl border border-[#222226]"
        />
      </div>
    </div>
  );
};

export const VideoPlayerModal: React.FC = () => {
  const { previewVideo, setPreviewVideo } = useStore();

  if (!previewVideo) return null;

  return (
    <div
      onClick={() => setPreviewVideo(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#121215] border border-[#222226] rounded-xl overflow-hidden shadow-2xl p-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#222226] mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FAFAFA]">
            Video Playback
          </span>
          <button
            onClick={() => setPreviewVideo(null)}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-white hover:bg-[#1C1C21] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center border border-[#222226]">
          <video
            src={previewVideo}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};
