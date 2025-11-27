import clsx from 'clsx';

/**
 * Button component
 * Reusable button with different variants
 * WCAG 2.1 AA compliant with 44px minimum touch targets
 */
const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  size = 'default',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-linkedin-500 text-white hover:bg-linkedin-600 focus:ring-linkedin-500 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 hover:scale-[1.02] active:scale-[0.98]',
    danger: 'bg-error text-white hover:bg-red-600 focus:ring-error shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
    outline: 'border-2 border-linkedin-500 text-linkedin-500 hover:bg-linkedin-50 focus:ring-linkedin-500 hover:shadow-sm active:scale-[0.98]',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-400 active:scale-[0.98]',
  };

  const sizeClasses = {
    small: 'px-3 py-2.5 text-sm min-h-[44px]', // WCAG AA compliant touch target
    default: 'px-4 py-2 text-base min-h-[44px]',
    large: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
