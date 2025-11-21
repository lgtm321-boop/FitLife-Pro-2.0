import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const styles = {
    success: 'bg-surface border-l-4 border-primary text-secondary',
    error: 'bg-surface border-l-4 border-red-500 text-secondary',
    info: 'bg-surface border-l-4 border-blue-500 text-secondary'
  };

  const iconColors = {
      success: 'text-primary',
      error: 'text-red-500',
      info: 'text-blue-500'
  }

  return (
    <div className={`fixed top-24 right-4 z-[100] flex items-center gap-3 px-4 py-4 rounded-lg shadow-2xl animate-fade-in max-w-xs md:max-w-sm border border-white/10 ${styles[type]}`}>
      <div className={iconColors[type]}>{icons[type]}</div>
      <span className="font-medium text-sm flex-1">{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/10 rounded-full p-1 transition-colors text-muted hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};