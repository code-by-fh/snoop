export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isActive: boolean;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  role?: 'user' | 'admin';
  isActive: boolean;
}
