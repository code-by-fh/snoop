import {
  Hammer,
  LayoutDashboard,
  List,
  LogOut,
  Menu,
  Settings,
  UserCircle,
  Users,
  X,
  ChevronLeft,
  ChevronRight
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
    { icon: Settings, label: 'Settings', path: '/settings', allowedRoles: ['admin'] }
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleSidebarCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
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
          fixed md:relative top-0 left-0 h-full z-50 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          flex flex-col transition-all duration-300
          ${isMobile ? `w-64 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}` : isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-4 border-b border-gray-100 dark:border-gray-700">
          <img
            src={Logo}
            alt="SNOOP Logo"
            className={`h-12 w-auto transition-all duration-300 ${isCollapsed ? 'h-12 w-12' : 'h-12 w-auto'}`}
          />
        </div>

        {/* User Info */}
        <div className={`flex items-center p-4 border-b border-gray-100 dark:border-gray-700 space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user?.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role} Account</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {navItems.filter(item => item.allowedRoles.includes(user?.role || '')).map(item => (
            <Link
              key={item.path}
              to={item.path}
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
          <button
            onClick={toggleSidebarCollapse}
            className={`flex items-center justify-center w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 ${isMobile ? 'pt-16' : ''}`}>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
