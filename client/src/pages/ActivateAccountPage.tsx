import { activateAccount } from "@/api";
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '@/assets/logo.png';
import ErrorInfo from "../components/common/ErrorInfo";
import LoadingPlaceholder from '../components/common/LoadingPlaceholder';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { CheckCircle } from 'lucide-react';

const ActivateAccountPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setError('Invalid activation link.');
            setLoading(false);
            return;
        }

        const activate = async () => {
            setLoading(true);
            try {
                await activateAccount(token);
                setSuccess('Your account has been activated successfully! Redirecting to login...');
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Failed to activate account.');
            } finally {
                setLoading(false);
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        activate();
    }, [navigate, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
            <div className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl text-center border border-gray-100 dark:border-gray-700">
                <div className="flex justify-center mb-6">
                    <img src={Logo} alt="SNOOP Logo" className="h-12 w-auto" />
                </div>

                {loading && (
                    <LoadingPlaceholder title="Activating..." description="Please wait while we activate your account." />
                )}

                {error && <ErrorInfo error={error} />}

                {success && (
                    <div className="flex flex-col items-center text-green-700 dark:text-green-300 space-y-2">
                        <CheckCircle className="w-8 h-8" />
                        <p>{success}</p>
                    </div>
                )}
            </div>

            <div className="fixed bottom-6 right-6 z-50">
                <ThemeSwitcher collapsed />
            </div>
        </div>
    );
};

export default ActivateAccountPage;
