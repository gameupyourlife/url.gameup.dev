'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface CollapsibleContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null)

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ open: openProp, onOpenChange, defaultOpen = false, children, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    const open = openProp !== undefined ? openProp : internalOpen
    
    const handleOpenChange = React.useCallback(
      (value: boolean) => {
        if (openProp === undefined) {
          setInternalOpen(value)
        }
        onOpenChange?.(value)
      },
      [onOpenChange, openProp]
    )

    const contextValue = React.useMemo(
      () => ({ open, onOpenChange: handleOpenChange }),
      [open, handleOpenChange]
    )

    return (
      <CollapsibleContext.Provider value={contextValue}>
        <div ref={ref} {...props}>
          {children}
        </div>
      </CollapsibleContext.Provider>
    )
  }
)
Collapsible.displayName = 'Collapsible'

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext)
    
    if (!context) {
      throw new Error('CollapsibleTrigger must be used within a Collapsible component')
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      context.onOpenChange(!context.open)
      onClick?.(event)
    }

    return <button ref={ref} onClick={handleClick} {...props} />
  }
)
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext)
    
    if (!context) {
      throw new Error('CollapsibleContent must be used within a Collapsible component')
    }

    if (!context.open) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn('animate-in slide-in-from-top-2 duration-200', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleTrigger, CollapsibleContent }