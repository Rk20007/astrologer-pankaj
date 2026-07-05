import { forwardRef } from 'react';

const buttonVariants = {
  primary: 'bg-primary text-white font-semibold rounded-xl border border-primary hover:bg-accent hover:text-foreground hover:shadow-[0_8px_24px_rgba(199,107,0,0.35)] active:scale-95 transform transition-all duration-300 ease-in-out',
  secondary: 'bg-secondary text-white font-semibold rounded-xl border border-secondary hover:bg-accent hover:text-foreground hover:shadow-[0_8px_24px_rgba(122,30,30,0.3)] active:scale-95 transform transition-all duration-300 ease-in-out',
  outline: 'border-2 border-primary text-primary bg-background hover:bg-primary hover:text-white hover:shadow-[0_8px_24px_rgba(199,107,0,0.3)] font-semibold rounded-xl active:scale-95 transform transition-all duration-300 ease-in-out',
  ghost: 'text-foreground hover:bg-muted font-medium rounded-lg active:scale-95 transition-all duration-300 ease-in-out',
  accent: 'bg-accent text-foreground font-semibold rounded-xl border border-accent hover:bg-primary hover:text-white hover:shadow-[0_8px_24px_rgba(212,175,55,0.35)] active:scale-95 transform transition-all duration-300 ease-in-out',
};

const sizeVariants = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
};

const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      className = '',
      children,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none';

    const variantStyles = buttonVariants[variant] || buttonVariants.primary;
    const sizeStyles = sizeVariants[size] || sizeVariants.md;

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
