import clsx from 'clsx';

/**
 * Card component
 * Reusable card wrapper with optional hover effect
 */
const Card = ({
  children,
  hover = false,
  className = '',
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-lg shadow-card p-6',
        hover && 'hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
