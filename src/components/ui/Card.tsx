'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion, useTransform } from 'motion/react';

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  pressable?: boolean;
  onClick?: () => void;
}

export function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  pressable = false,
  onClick,
  className = '',
  children,
  ...props
}: CardProps) {
  const reducedMotion = useReducedMotion();
  const isHovered = useMotionValue(0);
  const isPressed = useMotionValue(0);

  const y = useSpring(isHovered, {
    stiffness: 300,
    damping: 30,
    mass: 0.5
  });

  const scale = useSpring(isPressed, {
    stiffness: 400,
    damping: 25
  });

  const shadowIntensity = useTransform(
    isHovered,
    [0, 1],
    variant === 'elevated' ? ['0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05)', '0 25px 50px -12px rgb(0 0 0 / 0.15), 0 12px 24px -8px rgb(0 0 0 / 0.1)'] :
    variant === 'glass' ? ['0 8px 20px -4px rgb(0 0 0 / 0.08), 0 4px 8px -4px rgb(0 0 0 / 0.04)', '0 20px 40px -8px rgb(0 0 0 / 0.12), 0 8px 16px -8px rgb(0 0 0 / 0.08)'] :
    ['0 1px 3px rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.04)', '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05)']
  );

  const variantStyles = {
    default: 'bg-white border border-stone-200',
    outlined: 'bg-white border-2 border-stone-300',
    elevated: 'bg-white border-none',
    glass: 'bg-white/70 border border-white/20 backdrop-blur-xl',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const isInteractive = onClick || pressable;

  const handlePointerDown = () => {
    if (!reducedMotion) isPressed.set(1);
  };

  const handlePointerUp = () => {
    if (!reducedMotion) isPressed.set(0);
  };

  const handlePointerLeave = () => {
    if (!reducedMotion) isPressed.set(0);
  };

  const handleMouseEnter = () => {
    if (hover && !reducedMotion) isHovered.set(1);
  };

  const handleMouseLeave = () => {
    if (hover) isHovered.set(0);
  };

  // Omit event handlers that conflict with motion's types
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

  const baseProps = {
    className: `
      rounded-xl ${variantStyles[variant]} ${paddingStyles[padding]}
      ${isInteractive ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-500 focus-visible:ring-offset-2' : ''}
      ${className}
    `,
    style: {
      y: reducedMotion ? 0 : y,
      scale: reducedMotion ? 1 : scale,
      boxShadow: reducedMotion ? undefined : shadowIntensity,
    },
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerLeave: handlePointerLeave,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick,
    ...safeProps,
  };

  if (isInteractive) {
    return <motion.button {...baseProps}>{children}</motion.button>;
  }
  return <motion.div {...baseProps}>{children}</motion.div>;
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-xl font-semibold text-charcoal-900 tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`mt-1 text-sm text-stone-600 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-4 pt-4 border-t border-stone-100 ${className}`} {...props}>
      {children}
    </div>
  );
}