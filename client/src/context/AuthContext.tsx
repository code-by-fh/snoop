import axios from 'axios';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AuthState } from '../types/auth';
import { User } from '../types/user';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SIGNUP_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'SIGNUP_FAILURE'; payload: string }
  | { type: 'AUTH_LOADED' }
  | { type: 'AUTH_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'SIGNUP_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'SIGNUP_FAILURE':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'AUTH_LOADED':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: !!state.token,
      };
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Authentication error',
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;

          const response = await axios.get('/auth/me');

          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              token: state.token,
              user: response.data.user
            }
          });
        } catch (error) {
          dispatch({ type: 'AUTH_ERROR' });
        }
      } else {
        dispatch({ type: 'AUTH_LOADED' });
      }
    };

    loadUser();
  }, [state.token]);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', { username, password });

      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: response.data.token,
          user: response.data.user
        }
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post('/auth/signup', {
        username,
        email,
        password
      });

      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      dispatch({
        type: 'SIGNUP_SUCCESS',
        payload: {
          token: response.data.token,
          user: response.data.user
        }
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      dispatch({ type: 'SIGNUP_FAILURE', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    delete axios.defaults.headers.common['Authorization'];

    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
