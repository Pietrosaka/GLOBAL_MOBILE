import React from 'react';

interface AppContainerProps {
  children: React.ReactNode;
  className?: string;
}

const AppContainer: React.FC<AppContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gray-100 flex flex-col ${className}`}>
      <div className="flex-grow max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
};

export default AppContainer;