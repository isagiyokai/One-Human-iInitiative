'use client';

import React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className = '' }: TabsProps) {
  return (
    <div className={className} data-tabs>
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
      className={`flex border-b border-stone-200 ${className}`}
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
    throw new Error('TabsTrigger must be used within Tabs');
  }

  const { value: currentValue, onValueChange } = context;
  const isActive = currentValue === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabs-panel-${value}`}
      id={`tabs-trigger-${value}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => onValueChange(value)}
      className={`
        px-4 py-3 text-sm font-medium border-b-2 transition-colors
        focus:outline-none focus:ring-2 focus:ring-charcoal-500 focus:ring-offset-2
        ${isActive
          ? 'border-charcoal-900 text-charcoal-900'
          : 'border-transparent text-stone-500 hover:text-charcoal-700 hover:border-stone-300'
        }
        ${className}
      `}
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
    throw new Error('TabsContent must be used within Tabs');
  }

  const { value: currentValue } = context;
  const isActive = currentValue === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`tabs-panel-${value}`}
      aria-labelledby={`tabs-trigger-${value}`}
      className={className}
      {...props}
    >
      {children}
    </div>
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