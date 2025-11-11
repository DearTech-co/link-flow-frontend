/**
 * Loading component
 * Displays a spinner for loading states
 */
const Loading = ({ size = 'default', text = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    default: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-linkedin-500 border-t-transparent rounded-full animate-spin`}
      ></div>
      {text && (
        <p className="mt-3 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

export default Loading;
