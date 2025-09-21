'use client'

import { Button } from '@/components/ui/button'
import { SimpleThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'
import { Link as LinkIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()
  
  // Don't show header on dashboard pages since they have their own navigation
  if (pathname.startsWith('/dashboard')) {
    return null
  }

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <LinkIcon className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">URL Shortener</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <SimpleThemeToggle />
            <Link href="/auth/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}