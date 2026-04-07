import { useEffect } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

export default function ImageModal({ isOpen, imageUrl, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-[101]"
      >
        <span className="material-symbols-outlined text-2xl">close</span>
      </button>
      <div 
        className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <img 
          src={imageUrl} 
          alt="Transaction Receipt" 
          className="w-full h-full object-contain max-h-[90vh]"
        />
      </div>
    </div>
  );
}
