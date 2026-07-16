import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none",
          {
            'bg-primary text-white hover:bg-primary/90': variant === 'primary',
            'bg-background text-primary hover:bg-gray-100': variant === 'secondary',
            'border border-primary text-primary hover:bg-primary hover:text-white': variant === 'outline',
            'hover:bg-gray-100': variant === 'ghost',
            'h-9 px-4 text-sm': size === 'sm',
            'h-11 px-8 text-sm uppercase tracking-wider': size === 'md',
            'h-14 px-10 text-base uppercase tracking-wider': size === 'lg',
            'h-10 w-10 rounded-full': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

