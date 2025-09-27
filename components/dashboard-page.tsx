'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DashboardPageProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
  headerActions?: ReactNode
  fullWidth?: boolean
  noPadding?: boolean
}

export function DashboardPage({
  children,
  title,
  subtitle,
  className,
  headerActions,
  fullWidth = false,
  noPadding = false
}: DashboardPageProps) {
  return (
    <div className={cn(
      "space-y-6",
      !fullWidth && "max-w-7xl mx-auto",
      !noPadding && "px-4 sm:px-6 lg:px-8",
      className
    )}>
      {/* Page Header */}
      {(title || subtitle || headerActions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            {title && (
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            )}
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>
      )}

      {/* Page Content */}
      {children}
    </div>
  )
}