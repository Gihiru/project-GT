import React from 'react';
import { cn } from '../../lib/utils';

const Typography = React.forwardRef(({ 
  variant = 'p', 
  className, 
  children, 
  ...props 
}, ref) => {
  const variants = {
    h1: 'text-4xl font-bold text-white',
    h2: 'text-3xl font-semibold text-white',
    h3: 'text-2xl font-medium text-yellow-400',
    p: 'text-gray-300',
    small: 'text-sm text-gray-400',
    lead: 'text-lg text-gray-200',
    muted: 'text-gray-500',
  };

  const Component = variant;
  
  return (
    <Component
      ref={ref}
      className={cn(variants[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
});

Typography.displayName = 'Typography';

export { Typography };