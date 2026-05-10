'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface FormFieldProps {
  label: string
  error?: string
  className?: string
  required?: boolean
  children: React.ReactNode
}

export function FormField({ label, error, className, required, children }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className="text-xs font-medium text-slate-600">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-rose-500">{error}</p>
      )}
    </div>
  )
}

const inputBase =
  'w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150 disabled:opacity-50 disabled:bg-slate-50'

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }
>(({ className, hasError, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(inputBase, hasError && 'border-rose-400 focus:ring-rose-400', className)}
    {...props}
  />
))
Input.displayName = 'Input'

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }
>(({ className, hasError, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(inputBase, 'cursor-pointer', hasError && 'border-rose-400 focus:ring-rose-400', className)}
    {...props}
  />
))
Select.displayName = 'Select'

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean }
>(({ className, hasError, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      inputBase,
      'resize-none min-h-[80px]',
      hasError && 'border-rose-400 focus:ring-rose-400',
      className
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'
