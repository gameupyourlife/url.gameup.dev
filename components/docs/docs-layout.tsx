import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface DocsPageProps {
  title: string
  description: string
  icon?: ReactNode
  status?: 'Stable' | 'Beta' | 'Alpha' | 'Deprecated'
  children: ReactNode
  className?: string
}

export function DocsPage({
  title,
  description,
  icon,
  status = 'Stable',
  children,
  className
}: DocsPageProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      Stable: 'bg-green-100 text-green-800 border-green-300',
      Beta: 'bg-blue-100 text-blue-800 border-blue-300',
      Alpha: 'bg-orange-100 text-orange-800 border-orange-300',
      Deprecated: 'bg-red-100 text-red-800 border-red-300'
    }
    return colors[status as keyof typeof colors] || colors.Stable
  }

  return (
    <div className={cn('max-w-4xl mx-auto space-y-8', className)}>
      {/* Page Header */}
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {icon}
              <h1 className="text-3xl font-bold">{title}</h1>
              <Badge variant="outline" className={getStatusColor(status)}>
                {status}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {description}
            </p>
          </div>
        </div>
        <Separator />
      </div>

      {/* Page Content */}
      <div className="space-y-8">
        {children}
      </div>
    </div>
  )
}

interface DocsSection {
  title: string
  description?: string
  children: ReactNode
  id?: string
  className?: string
}

export function DocsSection({
  title,
  description,
  children,
  id,
  className
}: DocsSection) {
  return (
    <section id={id} className={cn('space-y-6', className)}>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </section>
  )
}

interface QuickStartProps {
  steps: {
    title: string
    description: string
    code?: string
    language?: string
  }[]
}

export function QuickStart({ steps }: QuickStartProps) {
  return (
    <Card className="border-rose-200 bg-rose-50/50 dark:bg-rose-900/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
          🚀 Quick Start
        </CardTitle>
        <CardDescription>
          Get started with this API in minutes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center text-sm font-semibold text-rose-600 dark:text-rose-400">
                {index + 1}
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                {step.code && (
                  <div className="mt-3">
                    <pre className="bg-background border rounded-lg p-3 text-sm overflow-x-auto">
                      <code>{step.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface OverviewCardProps {
  title: string
  description: string
  icon: ReactNode
  features: string[]
}

export function OverviewCard({ title, description, icon, features }: OverviewCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-rose-100 dark:bg-rose-900/20 rounded-lg">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}