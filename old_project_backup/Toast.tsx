import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} className="text-emerald-400" style={{ color: 'var(--success)' }} />;
      case 'error':
        return <AlertCircle size={18} className="text-red-400" style={{ color: 'var(--error)' }} />;
      case 'info':
      default:
        return <Info size={18} className="text-blue-400" style={{ color: 'var(--info)' }} />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.3)';
      case 'error':
        return 'rgba(239, 68, 68, 0.3)';
      case 'info':
      default:
        return 'rgba(59, 130, 246, 0.3)';
    }
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl transition-all duration-300 animate-slide-in"
      style={{
        background: 'rgba(17, 17, 17, 0.9)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${getBorderColor()}`,
        color: '#ffffff',
        minWidth: '280px',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)',
      }}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-grow text-[13.5px] font-medium">{message}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-neutral-400 hover:text-white transition-colors"
      >
        <X size={15} />
      </button>
    </div>
  );
};
