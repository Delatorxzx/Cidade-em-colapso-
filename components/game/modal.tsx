'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose?: () => void
  label: string
  children: React.ReactNode
  className?: string
  backdrop?: 'dim' | 'none'
}

export function Modal({ open, onClose, label, children, className, backdrop = 'dim' }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    ref.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={cn('absolute inset-0', backdrop === 'dim' && 'bg-navy-deep/75 backdrop-blur-[3px] animate-in fade-in')}
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cn('relative max-h-full outline-none', className)}
      >
        {children}
      </div>
    </div>
  )
}
