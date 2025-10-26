import React from 'react';
import { Trash2, Archive, X } from 'lucide-react';

interface ListingActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onArchive: () => void;
}

const ListingActionModal: React.FC<ListingActionModalProps> = ({ isOpen, onClose, onDelete, onArchive }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800 transition-all transform scale-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <Archive size={48} className="text-yellow-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Manage Listing
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Do you want to archive this listing or permanently delete it?
          </p>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onArchive}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 bg-yellow-500 hover:bg-yellow-600 flex items-center space-x-1"
          >
            <Archive size={16} />
            <span>Archive</span>
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 bg-red-600 hover:bg-red-700 flex items-center space-x-1"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingActionModal;
