import React from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'confirmation' | 'warning' | 'alert';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'confirmation',
}) => {
  if (!isOpen) return null;

  const variantConfig = {
    confirmation: {
      icon: <CheckCircle2 size={48} className="text-green-500" />,
      button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    },
    warning: {
      icon: <Info size={48} className="text-yellow-500" />,
      button: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    },
    alert: {
      icon: <AlertTriangle size={48} className="text-red-500" />,
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
  }[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800 transition-all transform scale-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>

        {/* Icon + Title + Message */}
        <div className="flex flex-col items-center text-center space-y-4">
          {variantConfig.icon}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{message}</p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${variantConfig.button}`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
