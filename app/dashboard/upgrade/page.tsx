'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { usePlan } from '@/lib/plan-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Check, 
  Zap, 
  ArrowLeft, 
  CreditCard, 
  Calendar,
  TrendingUp, 
  Crown,
  Sparkles,
  ArrowRight,
  Settings,
  BarChart3,
  Globe,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

export default function ManageSubscriptionPage() {
  const { currentPlan, cancelPlan } = usePlan()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  useEffect(() => {
    const getUser = async () => {
      const supabase = createBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUser(user)
      }
      setLoading(false)
    }

    getUser()
  }, [])

  // Current usage (mock data)
  const currentUsage = {
    urlsThisMonth: 23,
    totalClicks: 1247,
    totalUrls: 12,
    apiCalls: currentPlan.name === 'Free' ? 0 : 847
  }

  const usagePercentage = currentPlan.urlLimit === Number.POSITIVE_INFINITY ? 0 : (currentUsage.urlsThisMonth / currentPlan.urlLimit) * 100

  const plans = [
    {
      id: 'developer',
      name: "Developer",
      price: 19,
      yearlyPrice: 152,
      description: "Perfect for growing businesses",
      icon: <Zap className="h-5 w-5" />,
      features: ["5,000 URLs/month", "Advanced analytics", "Custom domains", "API access", "Priority support"]
    },
    {
      id: 'enterprise',
      name: "Enterprise", 
      price: 99,
      yearlyPrice: 792,
      description: "For large teams and organizations",
      icon: <Crown className="h-5 w-5" />,
      features: ["Unlimited URLs", "Team collaboration", "White-label", "24/7 support", "Custom integrations"]
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading subscription details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    window.location.href = '/auth/signin'
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/profile">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Manage Subscription</h1>
              <p className="text-muted-foreground">Manage your plan and billing preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Plan & Usage */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {currentPlan.name === 'Free' ? (
                        <Globe className="h-6 w-6 text-primary" />
                      ) : currentPlan.name === 'Developer' ? (
                        <Zap className="h-6 w-6 text-primary" />
                      ) : (
                        <Crown className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{currentPlan.name} Plan</CardTitle>
                      <CardDescription>
                        {currentPlan.name === 'Free' 
                          ? 'Get started with basic features'
                          : currentPlan.name === 'Developer'
                          ? 'Perfect for growing businesses'
                          : 'Enterprise-grade features'
                        }
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={currentPlan.name === 'Free' ? 'secondary' : 'default'}>
                    {currentPlan.name === 'Free' ? 'Active' : 'Pro'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Usage Statistics */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Current Usage</h4>
                    <span className="text-sm text-muted-foreground">
                      This month
                    </span>
                  </div>
                  
                  {/* URLs Usage */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>URLs created</span>
                      <span>
                        {currentUsage.urlsThisMonth} / {currentPlan.urlLimit === Number.POSITIVE_INFINITY ? '∞' : currentPlan.urlLimit}
                      </span>
                    </div>
                    {currentPlan.urlLimit !== Number.POSITIVE_INFINITY && (
                      <Progress value={usagePercentage} className="h-2" />
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{currentUsage.totalUrls}</p>
                      <p className="text-xs text-muted-foreground">Total URLs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{currentUsage.totalClicks.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Clicks</p>
                    </div>
                    {currentPlan.name !== 'Free' && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{currentUsage.apiCalls}</p>
                        <p className="text-xs text-muted-foreground">API Calls</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Current Plan Features */}
                <div>
                  <h4 className="font-semibold mb-3">Your Plan Includes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {currentPlan.features?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        {feature}
                      </div>
                    )) || (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          {currentPlan.urlLimit} URLs per month
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          Basic analytics
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          Community support
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Next Billing */}
                {currentPlan.name !== 'Free' && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Next billing date</span>
                      </div>
                      <span className="text-sm">October 21, 2025</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="text-sm font-medium">
                        ${currentPlan.name === 'Developer' ? '19' : '99'}/month
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Billing Settings */}
            {currentPlan.name !== 'Free' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Billing & Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Payment Method</p>
                      <p className="text-sm text-muted-foreground">•••• •••• •••• 4242</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Billing Cycle</p>
                      <p className="text-sm text-muted-foreground">Monthly billing</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Switch to Yearly
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Upgrade Options */}
          <div className="space-y-6">
            {currentPlan.name === 'Free' && (
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <Badge className="bg-primary/10 text-primary">Recommended</Badge>
                  </div>
                  <CardTitle className="text-primary">Ready to upgrade?</CardTitle>
                  <CardDescription>
                    Unlock powerful features and remove limitations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span>50x more URLs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <span>Advanced analytics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-600" />
                        <span>Custom domains</span>
                      </div>
                    </div>
                    
                    <Button className="w-full" asChild>
                      <Link href="/dashboard/checkout?plan=developer">
                        Upgrade to Developer
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Plans */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {currentPlan.name === 'Free' ? 'Available Plans' : 'Other Plans'}
                </CardTitle>
                <CardDescription>
                  Compare and switch to a different plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {plans
                  .filter(plan => plan.name !== currentPlan.name)
                  .map((plan) => (
                    <div key={plan.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-primary/10 rounded">
                            {plan.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold">{plan.name}</h4>
                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${billingCycle === 'yearly' ? plan.yearlyPrice : plan.price}</p>
                          <p className="text-xs text-muted-foreground">/{billingCycle === 'yearly' ? 'year' : 'month'}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 mb-4">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Check className="h-3 w-3 text-green-600" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full"
                        variant={plan.name === 'Developer' ? 'default' : 'outline'}
                        asChild
                      >
                        <Link href={`/dashboard/checkout?plan=${plan.id}&billing=${billingCycle}`}>
                          {currentPlan.name === 'Free' ? 'Upgrade' : 'Switch'} to {plan.name}
                        </Link>
                      </Button>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Billing Cycle Toggle */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Billing Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-1 rounded-lg inline-flex w-full">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all relative ${
                      billingCycle === 'yearly'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Yearly
                    <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5">
                      -20%
                    </Badge>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Cancel Subscription */}
            {currentPlan.name !== 'Free' && (
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-lg text-red-600 dark:text-red-400">
                    Cancel Subscription
                  </CardTitle>
                  <CardDescription>
                    You&apos;ll keep access until the end of your billing period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel your subscription?')) {
                        cancelPlan()
                      }
                    }}
                  >
                    Cancel Subscription
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}