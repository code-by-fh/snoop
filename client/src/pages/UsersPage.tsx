import ErrorInfo from '@/components/common/ErrorInfo';
import HeaderWithAction from '@/components/common/HeaderWithAction';
import LoadingPlaceholder from '@/components/common/LoadingPlaceholder';
import { ApiError } from '@/types/common';
import { PlusCircle } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { createUser, deleteUser, getUsers, updateUser } from '../api';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import UserFormModal from '../components/users/UserFormModal';
import UserTable from '../components/users/UserTable';
import { User, UserCreate, UserUpdate } from '../types/user';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (err: any) {
      setError(err?.response?.data as ApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateClick = () => {
    setCurrentUser(null);
    setError(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (user: User) => {
    setCurrentUser(user);
    setError(null);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDeleteId(userId);
    setIsConfirmModalOpen(true);
  };

  const handleSaveUser = async (userData: UserCreate | UserUpdate) => {
    setError(null);
    try {
      if (currentUser) {
        await updateUser(currentUser.id, userData);
      } else {
        await createUser(userData);
      }
      fetchUsers();
      setIsFormModalOpen(false);
    } catch (err: any) {
      setError(err?.response?.data as ApiError);
      toast.error(err?.response?.data?.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDeleteId) return;
    setError(null);
    try {
      await deleteUser(userToDeleteId);
      fetchUsers();
      toast('User deleted successfully!', { icon: '🗑️' });
    } catch (err: any) {
      setError(err?.response?.data as ApiError);
      toast.error(err?.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsConfirmModalOpen(false);
      setUserToDeleteId(null);
    }
  };

  if (loading) {
    return <LoadingPlaceholder title='Loading Users...' />
  };


  return (
    <div className="space-y-6">
      <HeaderWithAction
        title="User Management"
        description="Effortlessly manage your user accounts"
        actionElement={
          <button
            onClick={handleCreateClick}
            className="btn-primary flex items-center justify-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create New User
          </button>
        }
      />
      {
        error && <ErrorInfo error={error.message} />
      }

      <UserTable users={users} onEdit={handleEditClick} onDelete={handleDeleteClick} />

      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveUser}
        user={currentUser}
        apiError={error ? `${error.message}` : null}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this User? This action cannot be undone."
        confirmText="Delete"
        variant="alert"
      />
    </div>
  );
};

export default UsersPage;
