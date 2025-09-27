'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ReactNode
}

export function Breadcrumbs() {
  const pathname = usePathname()

  // Create breadcrumb items based on pathname
  const createBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    // Always start with dashboard
    if (paths[0] === 'dashboard') {
      breadcrumbs.push({
        label: 'Dashboard',
        href: '/dashboard',
        icon: <Home className="w-4 h-4" />
      })

      // Add subsequent path segments
      for (let i = 1; i < paths.length; i++) {
        const path = paths[i]
        const href = '/' + paths.slice(0, i + 1).join('/')
        
        // Convert path to readable label
        let label = path.charAt(0).toUpperCase() + path.slice(1)
        
        // Handle special cases
        switch (path) {
          case 'analytics':
            label = 'Analytics'
            break
          case 'links':
            label = 'Links'
            break
          case 'profile':
            label = 'Profile'
            break
          case 'settings':
            label = 'Settings'
            break
          case 'upgrade':
            label = 'Upgrade'
            break
          case 'checkout':
            label = 'Checkout'
            break
          default:
            // For dynamic routes like [id], show "Link Details"
            if (path.match(/^[a-f0-9-]+$/)) {
              label = 'Link Details'
            }
        }

        // Skip certain segments that shouldn't be in breadcrumbs
        if (!['api'].includes(path)) {
          breadcrumbs.push({
            label,
            href
          })
        }
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = createBreadcrumbs()

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center space-x-2">
          {index === breadcrumbs.length - 1 ? (
            // Current page - not clickable
            <div className="flex items-center space-x-1 text-foreground font-medium">
              {breadcrumb.icon}
              <span>{breadcrumb.label}</span>
            </div>
          ) : (
            // Previous pages - clickable
            <>
              <Link 
                href={breadcrumb.href}
                className="flex items-center space-x-1 hover:text-foreground transition-colors"
              >
                {breadcrumb.icon}
                <span>{breadcrumb.label}</span>
              </Link>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </div>
      ))}
    </nav>
  )
}