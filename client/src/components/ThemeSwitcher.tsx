import { Moon, Sun } from 'lucide-react';
import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface ThemeSwitcherProps {
  collapsed?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ collapsed = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center justify-center p-2 md:p-3
        bg-gray-100 dark:bg-gray-700 
        text-gray-700 dark:text-gray-300
        hover:bg-gray-200 dark:hover:bg-gray-600
        rounded-lg 
        transition-colors
        ${collapsed ? 'w-10 h-10 md:w-12 md:h-12' : 'w-full'}
      `}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 md:w-5 md:h-5" />
      ) : (
        <Moon className="w-4 h-4 md:w-5 md:h-5" />
      )}
      {!collapsed && (
        <span className="ml-2 text-sm md:text-base">
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeSwitcher;
