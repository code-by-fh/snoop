import {
  Hammer,
  LayoutDashboard,
  List,
  LogOut,
  Menu,
  Settings,
  UserCircle,
  Users,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const navItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/',
      allowedRoles: ['user', 'admin']
    },
    {
      icon: Hammer,
      label: 'Jobs',
      path: '/jobs',
      allowedRoles: ['user', 'admin']
    },
    {
      icon: List,
      label: 'Listings',
      path: '/listings',
      allowedRoles: ['user', 'admin']
    },
    {
      icon: Users,
      label: 'Users',
      path: '/users',
      allowedRoles: ['admin']
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings',
      allowedRoles: ['admin']
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between md:hidden">
          <div className="flex items-center space-x-3">
            <img src={Logo} alt="SNOOP Logo" className="h-10 w-15" />
          </div>
          <div className="flex items-center space-x-3">
            <ThemeSwitcher collapsed={true} />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile
            ? `fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } w-64`
            : 'w-64 relative'
          }
          bg-gray-50 dark:bg-gray-800
          shadow-lg border-r border-gray-200 dark:border-gray-700
          flex flex-col
        `}
      >
        {/* Desktop Header with Logo */}
        {!isMobile && (
          <div className="p-2 border-b border-gray-100 dark:border-gray-700 flex items-center justify-center">
            <div className="w-full h-full">
              <img src={Logo} alt="SNOOP Logo" className="w-full h-full object-contain" />
            </div>
          </div>
        )}

        {/* Mobile Header in Sidebar */}
        {isMobile && (
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={Logo} alt="SNOOP Logo" className="h-8 w-8" />
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                SNOOP
              </h1>
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* User Info */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role} Account
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {navItems
            .filter(item => item.allowedRoles.includes(user?.role || ''))
            .map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`
                  flex items-center p-3 mb-2 rounded-lg transition-all duration-200 
                  ${location.pathname === item.path
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))
          }
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col space-y-3">
            {/* Desktop Theme Toggle */}
            {!isMobile && (
              <div className="w-full">
                <ThemeSwitcher collapsed={false} />
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={() => {
                logout();
                closeMobileMenu();
              }}
              className="flex items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors w-full"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 ${isMobile ? 'pt-16' : ''}`}>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
