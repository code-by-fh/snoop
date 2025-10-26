import React from 'react';

interface HeaderWithActionProps {
  title?: string;
  description?: string;
  actionElement?: React.ReactNode;
}

const HeaderWithAction: React.FC<HeaderWithActionProps> = ({
  title = 'Title',
  description = 'Description',
  actionElement,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      </div>
      {actionElement && (
        <div className="w-full sm:w-auto flex justify-start sm:justify-end">
          {actionElement}
        </div>
      )}
    </div>
  );
};

export default HeaderWithAction;
