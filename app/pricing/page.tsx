import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Check, X, Zap, Users, Building2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - URL Shortener',
  description: 'Choose the perfect plan for your URL shortening needs. Start free and upgrade as you grow with our flexible pricing options.',
}

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: "$0",
      period: "forever",
      icon: Zap,
      popular: false,
      features: [
        { text: "50 URLs per month", included: true },
        { text: "Basic analytics", included: true },
        { text: "QR code generation", included: true },
        { text: "7-day link history", included: true },
        { text: "Standard support", included: true },
        { text: "Custom domains", included: false },
        { text: "Advanced analytics", included: false },
        { text: "Team collaboration", included: false },
        { text: "API access", included: false },
      ]
    },
    {
      name: "Developer",
      description: "For developers and growing businesses",
      price: "$19",
      period: "per month",
      icon: Users,
      popular: true,
      features: [
        { text: "5,000 URLs per month", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Custom domains", included: true },
        { text: "Unlimited link history", included: true },
        { text: "Priority support", included: true },
        { text: "API access", included: true },
        { text: "Team collaboration (5 members)", included: true },
        { text: "Custom branding", included: true },
        { text: "Bulk URL creation", included: false },
      ]
    },
    {
      name: "Enterprise",
      description: "For large teams and organizations",
      price: "$99",
      period: "per month",
      icon: Building2,
      popular: false,
      features: [
        { text: "Unlimited URLs", included: true },
        { text: "Advanced analytics & reporting", included: true },
        { text: "Multiple custom domains", included: true },
        { text: "Unlimited link history", included: true },
        { text: "24/7 premium support", included: true },
        { text: "Full API access", included: true },
        { text: "Unlimited team members", included: true },
        { text: "White-label solution", included: true },
        { text: "Bulk URL creation & management", included: true },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Simple, Transparent
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan for your needs. Start free and upgrade as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon
            return (
              <Card 
                key={plan.name} 
                className={`relative transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'hover:scale-105'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    plan.popular 
                      ? 'bg-primary/20' 
                      : 'bg-muted'
                  }`}>
                    <IconComponent className={`w-8 h-8 ${
                      plan.popular 
                        ? 'text-primary' 
                        : 'text-muted-foreground'
                    }`} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">/{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm ${
                          feature.included 
                            ? 'text-foreground' 
                            : 'text-muted-foreground line-through'
                        }`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Link href={plan.name === 'Free' ? '/auth/signup' : '/auth/signup'} className="block">
                      <Button 
                        className={`w-full h-12 font-semibold ${
                          plan.popular 
                            ? 'shadow-lg hover:shadow-xl' 
                            : ''
                        }`}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        {plan.name === 'Free' ? 'Get Started Free' : `Start ${plan.name} Plan`}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Compare All Features</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-border rounded-lg">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-semibold">Features</th>
                  <th className="text-center p-4 font-semibold">Free</th>
                  <th className="text-center p-4 font-semibold">Developer</th>
                  <th className="text-center p-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium">Monthly URL Limit</td>
                  <td className="text-center p-4">50</td>
                  <td className="text-center p-4">5,000</td>
                  <td className="text-center p-4">Unlimited</td>
                </tr>
                <tr className="border-b border-border bg-muted/20">
                  <td className="p-4 font-medium">Custom Domains</td>
                  <td className="text-center p-4"><X className="w-4 h-4 text-muted-foreground mx-auto" /></td>
                  <td className="text-center p-4"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium">Analytics</td>
                  <td className="text-center p-4">Basic</td>
                  <td className="text-center p-4">Advanced</td>
                  <td className="text-center p-4">Advanced + Reporting</td>
                </tr>
                <tr className="border-b border-border bg-muted/20">
                  <td className="p-4 font-medium">API Access</td>
                  <td className="text-center p-4"><X className="w-4 h-4 text-muted-foreground mx-auto" /></td>
                  <td className="text-center p-4"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4">Full Access</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 font-medium">Team Members</td>
                  <td className="text-center p-4">1</td>
                  <td className="text-center p-4">5</td>
                  <td className="text-center p-4">Unlimited</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="p-4 font-medium">Support</td>
                  <td className="text-center p-4">Standard</td>
                  <td className="text-center p-4">Priority</td>
                  <td className="text-center p-4">24/7 Premium</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">Our Free plan is available forever. Paid plans come with a 14-day money-back guarantee.</p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">What happens to my URLs if I downgrade?</h3>
              <p className="text-muted-foreground">Your existing URLs remain active. You'll just be limited to your new plan's monthly quota for new URLs.</p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-2">Do you offer custom solutions?</h3>
              <p className="text-muted-foreground">Yes! Contact us for custom enterprise solutions tailored to your specific needs.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 py-16 bg-primary/5 rounded-3xl border border-border/50">
          <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust our platform for their URL shortening needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl">
                Start Free Today
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}