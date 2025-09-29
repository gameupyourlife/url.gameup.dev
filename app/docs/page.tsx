import { NextPage } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Code,
    Book,
    Key, BarChart3,
    Link as LinkIcon,
    User,
    ArrowRight,
    ExternalLink,
    Zap
} from 'lucide-react'

const DocsPage: NextPage = () => {
  const sections = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of our API and get up and running quickly',
      icon: Book,
      href: '/docs/getting-started',
      color: 'bg-blue-500'
    },
    {
      title: 'Authentication',
      description: 'Understand API keys, scopes, and security best practices',
      icon: Key,
      href: '/docs/authentication',
      color: 'bg-green-500'
    },
    {
      title: 'URL Management',
      description: 'Create, update, and manage your shortened URLs programmatically',
      icon: LinkIcon,
      href: '/docs/url-management',
      color: 'bg-purple-500'
    },
    {
      title: 'Analytics',
      description: 'Access detailed analytics and insights for your URLs',
      icon: BarChart3,
      href: '/docs/analytics',
      color: 'bg-orange-500'
    },
    {
      title: 'User Profile',
      description: 'Manage user profiles and account settings via API',
      icon: User,
      href: '/docs/user-profile',
      color: 'bg-pink-500'
    },
    {
      title: 'API Reference',
      description: 'Complete reference for all endpoints with examples',
      icon: Code,
      href: '/docs/api-reference',
      color: 'bg-indigo-500'
    }
  ]

  const quickLinks = [
    { title: 'Create API Key', href: '/dashboard/settings?tab=security', external: false },
    { title: 'Interactive Examples', href: '/docs/examples', external: false },
    { title: 'SDKs & Libraries', href: '/docs/sdks', external: false },
    { title: 'Postman Collection', href: '#', external: true }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
            <Code className="h-4 w-4 mr-2" />
            API Documentation
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Build with our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              powerful API
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Integrate URL shortening, analytics, and management into your applications with our comprehensive RESTful API. 
            Get started in minutes with our detailed documentation and examples.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/docs/getting-started">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs/api-reference">
                API Reference
                <Code className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* API Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Easy Integration</CardTitle>
              <CardDescription>
                Simple REST API with consistent JSON responses and comprehensive error handling
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <Key className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle>Secure Authentication</CardTitle>
              <CardDescription>
                API key authentication with scoped permissions and usage tracking
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle>Rich Analytics</CardTitle>
              <CardDescription>
                Detailed click tracking, geographic data, and performance insights
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Documentation Sections */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <Card key={section.href} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                <Link href={section.href}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-10 h-10 ${section.color} rounded-lg flex items-center justify-center`}>
                        <section.icon className="h-5 w-5 text-white" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {section.title}
                    </CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>
                Jump to the most commonly used resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickLinks.map((link) => (
                  <Button
                    key={link.href}
                    variant="outline"
                    asChild
                    className="justify-between"
                  >
                    <Link href={link.href} target={link.external ? '_blank' : undefined}>
                      {link.title}
                      {link.external ? (
                        <ExternalLink className="h-4 w-4" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle>Ready to get started?</CardTitle>
              <CardDescription>
                Create your first API key and start building in minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/dashboard/settings?tab=security">
                  Create API Key
                  <Key className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/getting-started">
                  Read Documentation
                  <Book className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DocsPage