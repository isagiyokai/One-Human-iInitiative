'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence, MotionValue } from 'motion/react';
import { cn } from '@/lib/utils';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ children, className = '' }: TabsProps) {
  return (
    <div className={cn('data-tabs', className)} data-tabs>
      {children}
    </div>
  );
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function TabsList({ className = '', children, ...props }: TabsListProps) {
  return (
    <div
      className={cn('grid bg-stone-100 rounded-xl p-1', className)}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({ value, className = '', children, ...props }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error('TabsTrigger must be used within TabsProvider');
  }

  const { value: currentValue, onValueChange } = context;
  const isActive = currentValue === value;
  const reducedMotion = useReducedMotion() ?? false;

  const x = useMotionValue(0);
  const width = useMotionValue(0);
  const backgroundX = useSpring(x, { stiffness: 500, damping: 35 });
  const backgroundWidth = useSpring(width, { stiffness: 500, damping: 35 });

  return (
    <TabsTriggerInner
      value={value}
      isActive={isActive}
      onValueChange={onValueChange}
      className={className}
      children={children}
      reducedMotion={reducedMotion}
      backgroundX={backgroundX}
      backgroundWidth={backgroundWidth}
      {...props}
    />
  );
}

function TabsTriggerInner({
  value,
  isActive,
  onValueChange,
  className = '',
  children,
  reducedMotion,
  backgroundX,
  backgroundWidth,
  ...props
}: TabsTriggerProps & {
  isActive: boolean;
  onValueChange: (value: string) => void;
  reducedMotion: boolean;
  backgroundX: MotionValue<number>;
  backgroundWidth: MotionValue<number>;
}) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (ref.current && isActive) {
      const rect = ref.current.getBoundingClientRect();
      const parentRect = ref.current.parentElement?.getBoundingClientRect();
      if (parentRect) {
        backgroundX.set(rect.left - parentRect.left);
        backgroundWidth.set(rect.width);
      }
    }
  }, [isActive, backgroundX, backgroundWidth]);

  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabs-panel-${value}`}
      id={`tabs-trigger-${value}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => onValueChange(value)}
      className={cn(
        'relative z-10 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-500 focus-visible:ring-offset-2',
        isActive
          ? 'border-charcoal-900 text-charcoal-900'
          : 'border-transparent text-stone-500 hover:text-charcoal-700 hover:border-stone-300',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({ value, className = '', children, ...props }: TabsContentProps) {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error('TabsContent must be used within TabsProvider');
  }

  const { value: currentValue } = context;
  const isActive = currentValue === value;
  const reducedMotion = useReducedMotion() ?? false;

  if (!isActive) return null;

  // Omit props that have incompatible types with motion.div
  const {
    onDrag,
    onDragStart,
    onDragEnd,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    onTransitionStart,
    onTransitionEnd,
    onTransitionRun,
    onTransitionCancel,
    ...safeProps
  } = props;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        role="tabpanel"
        id={`tabs-panel-${value}`}
        aria-labelledby={`tabs-trigger-${value}`}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30, duration: reducedMotion ? 0.15 : 0.3 }}
        className={cn('animate-fade-in', className)}
        {...safeProps}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | null>(null);

export function TabsProvider({ value, onValueChange, children }: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      {children}
    </TabsContext.Provider>
  );
}