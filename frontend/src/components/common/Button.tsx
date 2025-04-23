import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'gameAction';
type ButtonSize = 'standard' | 'compact';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'standard',
  isFullWidth = false,
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes for all button variants
  const baseClasses = 'flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-[#0F4C81] text-white hover:bg-[#0D3F6A] focus:ring-[#0F4C81]/50 disabled:bg-[#0F4C81]/50',
    secondary: 'border-2 border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81]/10 focus:ring-[#0F4C81]/50 disabled:border-[#0F4C81]/50 disabled:text-[#0F4C81]/50',
    gameAction: 'bg-[#FFBF00] text-[#333333] hover:bg-[#F7B500] focus:ring-[#FFBF00]/50 disabled:bg-[#FFBF00]/50'
  };
  
  // Size-specific classes
  const sizeClasses = {
    standard: 'px-6 py-3 text-base',
    compact: 'px-4 py-2 text-sm'
  };
  
  // Width class
  const widthClass = isFullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${className}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button; 