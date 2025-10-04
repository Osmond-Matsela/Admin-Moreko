
import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'confirm';
  message: string;
  title?: string;
  onConfirm?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  type, 
  message, 
  title,
  onConfirm 
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />;
      case 'confirm':
        return <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case 'success':
        return 'Success!';
      case 'error':
        return 'Error';
      case 'confirm':
        return 'Confirmation';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      case 'confirm':
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-100/60 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            {getIcon()}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {getTitle()}
            </h3>
            <p className="text-gray-600 mb-6">
              {message}
            </p>

            <div className="flex space-x-3 justify-center">
              {type === 'confirm' ? (
                <>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`px-6 py-2 text-white rounded-lg transition-colors ${getButtonColor()}`}
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className={`px-8 py-2 text-white rounded-lg transition-colors ${getButtonColor()}`}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};