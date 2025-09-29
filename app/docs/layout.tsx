'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    BookOpen,
    Rocket,
    Code2,
    Database,
    Shield,
    Zap,
    BarChart3,
    QrCode,
    Globe,
    Settings,
    FileText,
    HelpCircle,
    ExternalLink
} from 'lucide-react'

interface DocsLayoutProps {
  children: ReactNode
}

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Overview', href: '/docs', icon: BookOpen },
      { title: 'Quick Start', href: '/docs/getting-started', icon: Rocket },
      { title: 'Authentication', href: '/docs/authentication', icon: Shield },
    ]
  },
  {
    title: 'API Reference',
    items: [
      { title: 'API Overview', href: '/docs/api-reference', icon: Code2 },
      { title: 'URL Management', href: '/docs/api-reference/urls', icon: Database },
      { title: 'Analytics', href: '/docs/api-reference/analytics', icon: BarChart3 },
      { title: 'QR Codes', href: '/docs/api-reference/qr-codes', icon: QrCode },
      { title: 'Webhooks', href: '/docs/api-reference/webhooks', icon: Settings },
    ]
  },
  {
    title: 'Features',
    items: [
      { title: 'Custom Domains', href: '/docs/features/custom-domains', icon: Globe },
      { title: 'Advanced Analytics', href: '/docs/features/analytics', icon: BarChart3 },
      { title: 'Team Management', href: '/docs/features/teams', icon: Settings },
      { title: 'Export & Reports', href: '/docs/features/exports', icon: FileText },
    ]
  },
  {
    title: 'Examples',
    items: [
      { title: 'Code Examples', href: '/docs/examples', icon: Code2 },
      { title: 'SDKs & Libraries', href: '/docs/examples/sdks', icon: Database },
      { title: 'Integrations', href: '/docs/examples/integrations', icon: ExternalLink },
    ]
  },
  {
    title: 'Help & Support',
    items: [
      { title: 'FAQ', href: '/docs/faq', icon: HelpCircle },
      { title: 'Troubleshooting', href: '/docs/troubleshooting', icon: Settings },
      { title: 'Rate Limits', href: '/docs/rate-limits', icon: Zap },
    ]
  }
]

function NavLink({ href, title, icon: Icon, isActive }: { 
  href: string
  title: string 
  icon: React.ComponentType<{ className?: string }>
  isActive: boolean 
}) {
  return (
    <Link href={href}>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start text-left h-auto py-2 px-3',
          isActive && 'bg-muted/50 font-medium'
        )}
      >
        <Icon className="mr-2 h-4 w-4" />
        {title}
      </Button>
    </Link>
  )
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 lg:shrink-0">
            <div className="sticky top-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Documentation</h2>
              </div>
              
              <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
                <div className="space-y-6 pr-4">
                  {navigation.map((section) => (
                    <div key={section.title}>
                      <h3 className="font-medium text-sm text-muted-foreground mb-3 px-3">
                        {section.title.toUpperCase()}
                      </h3>
                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <NavLink
                            key={item.href}
                            href={item.href}
                            title={item.title}
                            icon={item.icon}
                            isActive={pathname === item.href}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="max-w-4xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}