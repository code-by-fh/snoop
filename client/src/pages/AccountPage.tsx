import { getUserProfile, updateUserProfile } from '@/api';
import LoadingPlaceholder from '@/components/common/LoadingPlaceholder';
import { ApiError } from '@/types/common';
import { Edit, Eye, EyeOff, Loader2, User as UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PasswordModal from '../components/modals/PasswordModal';
import { User, UserUpdate } from '../types/user';
import HeaderWithAction from '@/components/common/HeaderWithAction';

const AccountPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [formData, setFormData] = useState<UserUpdate>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await getUserProfile();
                setUser(response.data);
                setFormData({
                    username: response.data.username,
                    email: response.data.email,
                });
            } catch {
                setError({ message: 'Failed to fetch user profile' });
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (key: keyof UserUpdate, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        if (formData.password && formData.password !== confirmPassword) {
            setError({ message: 'Passwords do not match.', error: "Take a look at your new password" });
            return;
        }
        setIsModalOpen(true);
    };

    const handleConfirmPassword = async (currentPassword: string) => {
        if (!user) return;
        setSaving(true);
        setError(null);
        setIsModalOpen(false);

        try {
            const updatedData: UserUpdate = { ...formData, currentPassword };
            const updated = await updateUserProfile(updatedData);
            toast.success('Profile updated successfully!');
            setUser(updated.data);
            setFormData({
                username: updated.data.username,
                email: updated.data.email,
            });
            setConfirmPassword('');
        } catch (err: any) {
            setError(err?.response?.data as ApiError);
        } finally {
            setSaving(false);
        }
    };


    if (loading) {
        return <LoadingPlaceholder title='Loading Settings...' />
    }

    if (!user) {
        return <div className="text-center text-red-500">No user data found.</div>;
    }

    return (
        <div className="space-y-6">
            <HeaderWithAction title="User Profile" description="Manage your account details" />

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-8 space-y-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user.username}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.role} Account</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-md text-sm">
                            <p className="font-semibold whitespace-pre-line">{error.message}</p>
                            {error.error && <p className="text-xs">{error.error}</p>}
                        </div>
                    )}

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                        <input
                            type="text"
                            className="snoop-input"
                            value={formData.username || ''}
                            onChange={(e) => handleChange('username', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            className="snoop-input"
                            value={formData.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col space-y-2 relative">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password (Leave blank to keep current)</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="snoop-input pr-10"
                            placeholder="Enter new password"
                            value={formData.password || ''}
                            onChange={(e) => handleChange('password', e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-8 text-gray-500 dark:text-gray-400"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="flex flex-col space-y-2 relative">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password (Leave blank to keep current)</label>
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            className="snoop-input pr-10"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-8 text-gray-500 dark:text-gray-400"
                            onClick={() => setShowConfirm((prev) => !prev)}
                        >
                            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                        {saving && <Loader2 className="animate-spin w-4 h-4" />}
                        <Edit className="w-4 h-4" />
                        <span>Save Changes</span>
                    </button>
                </div>

                <div className="text-xs text-gray-400 dark:text-gray-500">
                    Account created: {new Date(user.createdAt).toLocaleDateString()}
                </div>
            </div>

            <PasswordModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmPassword}
                saving={saving}
            />
        </div>
    );
};

export default AccountPage;
