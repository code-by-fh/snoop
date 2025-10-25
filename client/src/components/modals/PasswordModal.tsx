import { Eye, EyeOff, Key, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (currentPassword: string) => void;
    saving: boolean;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onConfirm, saving }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);

    const handleConfirm = () => {
        onConfirm(currentPassword);
        setCurrentPassword('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Confirm Your Password
                </h2>

                <div className="relative">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Current Password</label>
                    <input
                        type={showCurrent ? 'text' : 'password'}
                        className="snoop-input pr-10"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-8 text-gray-500 dark:text-gray-400"
                        onClick={() => setShowCurrent((prev) => !prev)}
                    >
                        {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={saving || !currentPassword}
                        className="px-4 py-2 rounded bg-blue-600 dark:bg-blue-500 text-white flex items-center space-x-2"
                    >
                        {saving && <Loader2 className="animate-spin w-4 h-4" />}
                        <Key className="w-4 h-4" />
                        <span>Confirm</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordModal;