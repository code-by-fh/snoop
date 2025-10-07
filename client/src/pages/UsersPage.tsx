import { PlusCircle } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { createUser, deleteUser, getUsers, updateUser } from '../api';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import UserFormModal from '../components/users/UserFormModal';
import UserTable from '../components/users/UserTable';
import { User, UserCreate, UserUpdate } from '../types/user';
import toast from 'react-hot-toast';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    console.log('Fetching users...');
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateClick = () => {
    setCurrentUser(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (user: User) => {
    setCurrentUser(user);
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save user');
    } finally {
      setIsFormModalOpen(false);
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
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsConfirmModalOpen(false);
      setUserToDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Header */}
        <div >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Effortlessly manage your user accounts
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="btn-primary w-full sm:w-auto flex items-center justify-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New User
        </button>
      </div>

      {/* Status Messages */}
      {loading && (
        <div className="text-center text-gray-500 dark:text-gray-300">Loading users...</div>
      )}

      {error && (
        <div className="rounded-md bg-red-100 dark:bg-red-900 p-4 text-sm text-red-700 dark:text-red-200 border border-red-300 dark:border-red-700">
          Error: {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <UserTable users={users} onEdit={handleEditClick} onDelete={handleDeleteClick} />
      )}

      {/* Modals */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveUser}
        user={currentUser}
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
