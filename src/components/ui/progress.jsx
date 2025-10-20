import React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-4 w-full overflow-hidden border-2 border-black bg-gray-200',
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-brand-green transition-all"
      style={{ 
        transform: `translateX(-${100 - (value || 0)}%)`,
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(22, 27, 71, 0.1) 10px, rgba(22, 27, 71, 0.1) 20px)'
      }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };