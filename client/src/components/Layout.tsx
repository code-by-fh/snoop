import {
  ChevronLeft,
  ChevronRight,
  Hammer,
  LayoutDashboard,
  List,
  LogOut,
  Megaphone,
  Menu,
  Settings,
  UserCircle,
  Users,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.png';
import Logo_Small from '../assets/logo_small.png';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';

const Layout: React.FC = () => {
  const isDemo = import.meta.env.VITE_IS_DEMO === 'true' || false;
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', allowedRoles: ['user', 'admin'] },
    { icon: Hammer, label: 'Jobs', path: '/jobs', allowedRoles: ['user', 'admin'] },
    { icon: List, label: 'Listings', path: '/listings', allowedRoles: ['user', 'admin'] },
    { icon: Users, label: 'Users', path: '/users', allowedRoles: ['admin'] },
    { icon: UserCircle, label: 'Account', path: '/account', allowedRoles: ['user', 'admin'] },
    { icon: Settings, label: 'Settings', path: '/settings', allowedRoles: ['admin'] },
    { icon: Megaphone, label: 'Notifications', path: '/notifications', allowedRoles: ['admin'] },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleSidebarCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div
      className={`
    flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100
    ${isDemo
          ? 'mt-8 h-[calc(100vh-2rem)] md:h-[calc(100vh-2rem)]'
          : 'h-screen'
        }
  `}
    >
      {isDemo && (
        <div className="fixed top-0 left-0 w-full z-50 bg-yellow-400 dark:bg-yellow-600 text-gray-900 dark:text-gray-900 text-center py-2 px-4 font-semibold shadow-md">
          ⚠️ This is a demo version. Please use at your own risk.
        </div>
      )}


      {/* Mobile Header */}
      {isMobile && (
        <header
          className={`fixed left-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between transition-all ${isMobile ? 'mt-8' : ''}`}>
          <img src={Logo} alt="SNOOP Logo" className="h-10 w-auto" />
          <div className="flex items-center space-x-3">
            <ThemeSwitcher collapsed />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </header>
      )}


      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
      <aside
        className={`
      fixed md:relative top-0 left-0 h-full z-40 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
      flex flex-col transition-all duration-300
      ${isMobile ? `w-full transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isDemo ? 'mt-8' : ''}` : isCollapsed ? 'w-20' : 'w-64'}
    `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-4 border-b border-gray-100 dark:border-gray-700">
          <img
            src={isCollapsed ? Logo_Small : Logo}
            alt="SNOOP Logo"
            className={`h-12 w-auto transition-all duration-300 ${isCollapsed ? 'h-8 w-8' : 'h-12 w-auto'}`}
          />
        </div>

        {/* User Info */}
        <Link
          to="/account"
          className={`group flex items-center p-4 border-b border-gray-100 dark:border-gray-800 transition-all duration-200 cursor-pointer 
    hover:bg-gray-50 dark:hover:bg-gray-800/70 ${isCollapsed ? 'justify-center' : ''}`}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 rounded-full flex items-center justify-center shadow-md">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
          </div>

          {!isCollapsed && (
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                <span> Logged in as:</span> {user?.username || 'User'}
              </p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                <span>Role:</span> {user?.role ? `${user.role}` : 'Click to view settings'}
              </p>
            </div>
          )}
        </Link>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {navItems
            .filter(item => item.allowedRoles.includes(user?.role || ''))
            .map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => { if (isMobile) closeMobileMenu(); }}
                className={`
          flex items-center p-3 mb-2 rounded-lg transition-all duration-300
          ${location.pathname === item.path
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}
          ${isCollapsed ? 'justify-center' : ''}
        `}
              >
                <item.icon className="w-5 h-5 transition-colors duration-300" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col space-y-2 items-center">
          {!isMobile && <ThemeSwitcher collapsed={isCollapsed} />}
          <button
            onClick={() => { logout(); closeMobileMenu(); }}
            className={`flex items-center justify-center w-full p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition
              ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="mr-2 w-5 h-5" />
            {!isCollapsed && 'Logout'}
          </button>
          {/* Collapse / Expand Button unter Logout */}
          {!isMobile && (
            <button
              onClick={toggleSidebarCollapse}
              className={`flex items-center justify-center w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 ${isMobile ? `pt-16 ${isDemo ? 'mt-8' : ''}` : ''}`}>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>

      <Toaster
        position="bottom-right"
        gutter={8}
        toastOptions={{ duration: 3000, className: 'modern-toast' }}
      />
    </div>
  );
};

export default Layout;
