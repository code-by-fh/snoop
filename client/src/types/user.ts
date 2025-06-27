export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export interface UserUpdate {
  username?: string;
  email?: string;
  password?: string;
  role?: 'user' | 'admin';
}
