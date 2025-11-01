import React from 'react';

interface GenericToggleSwitchProps {
  id: string;
  isActive: boolean;
  onToggle: (id: string, newState: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const GenericToggleSwitch: React.FC<GenericToggleSwitchProps> = ({
  id,
  isActive,
  onToggle,
  disabled = false,
  size = 'md',
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { container: 'h-5 w-10', toggle: 'h-3 w-3', translate: 'translate-x-5' };
      case 'lg':
        return { container: 'h-8 w-16', toggle: 'h-6 w-6', translate: 'translate-x-8' };
      default:
        return { container: 'h-7 w-14', toggle: 'h-6 w-6', translate: 'translate-x-7' };
    }
  };

  const sizeClasses = getSizeClasses();


  return (
    <div className="flex mt-1">
      <button
        type="button"
        onClick={() => onToggle(id, !isActive)}
        disabled={disabled}
        className={`relative inline-flex items-center ${sizeClasses.container} rounded-full border-2 transition-colors duration-200 
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${isActive ? 'bg-blue-500' : 'bg-gray-300'}
        `}
      >
        <span
          className={`inline-block ${sizeClasses.toggle} transform rounded-full bg-white shadow transition-transform duration-200 
          ${isActive ? sizeClasses.translate : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
};

export default GenericToggleSwitch;
