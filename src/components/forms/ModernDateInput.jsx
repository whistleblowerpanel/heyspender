import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, formatDistanceToNow, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, isPast } from 'date-fns';
import { cn } from '@/lib/utils';

/**
 * Modern card-based date picker with custom calendar design
 */
const ModernDateInput = React.forwardRef(({
  value,
  onChange,
  onBlur,
  className,
  disabled,
  minDate,
  placeholder = 'Pick a date',
  showRelativeHint = true,
  ...props
}, ref) => {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());

  const handleSelect = (date) => {
    onChange?.(date);
    setOpen(false);
  };

  const handleMonthChange = (direction) => {
    setCurrentMonth(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const getRelativeHint = (date) => {
    if (!date || !showRelativeHint) return null;
    
    try {
      const distance = formatDistanceToNow(date, { addSuffix: true });
      return `(${distance})`;
    } catch {
      return null;
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add empty cells for days before month start
  const startDay = monthStart.getDay();
  const emptyDays = Array.from({ length: startDay }, (_, i) => null);

  const allDays = [...emptyDays, ...days];

  const isDateDisabled = (date) => {
    if (minDate && date < minDate) return true;
    return false;
  };

  const getDayClassName = (day) => {
    if (!day) return 'h-10 w-10'; // Empty cell
    
    const baseClasses = 'h-10 w-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer';
    
    if (isSameDay(day, value)) {
      return cn(baseClasses, 'bg-brand-purple-dark text-white shadow-lg transform scale-105');
    }
    
    if (isToday(day)) {
      return cn(baseClasses, 'bg-brand-purple-light text-brand-purple-dark border-2 border-brand-purple-dark font-bold');
    }
    
    if (isDateDisabled(day)) {
      return cn(baseClasses, 'text-gray-300 cursor-not-allowed hover:bg-transparent');
    }
    
    if (!isSameMonth(day, currentMonth)) {
      return cn(baseClasses, 'text-gray-400 hover:bg-gray-100');
    }
    
    return cn(baseClasses, 'text-gray-700 hover:bg-brand-purple-light hover:text-brand-purple-dark');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal border-2 border-black hover:bg-gray-50 bg-white shadow-sm',
            !value && 'text-muted-foreground',
            className
          )}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            <span>
              {format(value, 'PPP')}
              {showRelativeHint && (
                <span className="ml-2 text-xs text-gray-500">
                  {getRelativeHint(value)}
                </span>
              )}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 border-2 border-black bg-white shadow-xl" align="start">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMonthChange('prev')}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h3 className="text-lg font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMonthChange('next')}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {allDays.map((day, index) => (
              <div
                key={index}
                className={getDayClassName(day)}
                onClick={() => day && !isDateDisabled(day) && handleSelect(day)}
              >
                {day && format(day, 'd')}
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelect(new Date())}
                className="flex-1 text-xs"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelect(addMonths(new Date(), 1))}
                className="flex-1 text-xs"
              >
                Next Month
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});

ModernDateInput.displayName = 'ModernDateInput';

export default ModernDateInput;
