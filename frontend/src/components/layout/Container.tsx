import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  maxWidth = 'lg',
  padding = true,
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full',
  };

  const paddingClasses = padding ? 'px-4 sm:px-6 md:px-8' : '';

  return (
    <div
      className={`mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses} ${className}`}
    >
      {children}
    </div>
  );
};

export default Container; 