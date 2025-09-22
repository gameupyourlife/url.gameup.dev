'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowUpRight, Calendar, BarChart3, Users, AlertTriangle } from 'lucide-react'
import { usePlan } from '@/lib/plan-context'
import { toast } from 'sonner'

export function PlanManagement() {
  const { currentPlan, cancelPlan, isUpgrading } = usePlan()
  const [isCancelling, setIsCancelling] = useState(false)
  
  // Mock usage data
  const urlsUsed = 23
  const usagePercentage = currentPlan.urlLimit === Infinity ? 0 : (urlsUsed / currentPlan.urlLimit) * 100

  const handleCancelPlan = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return
    }

    setIsCancelling(true)
    try {
      await cancelPlan()
      toast.success('Plan cancelled successfully. You can continue using premium features until your billing period ends.')
    } catch (error) {
      toast.error('Failed to cancel plan. Please try again.')
    } finally {
      setIsCancelling(false)
    }
  }

  const plans = [
    {
      name: "Developer",
      price: "$19",
      period: "per month",
      description: "Perfect for growing businesses",
      features: [
        "5,000 URLs per month",
        "Advanced analytics",
        "Custom domains",
        "API access",
        "Priority support"
      ]
    },
    {
      name: "Enterprise",
      price: "$99", 
      period: "per month",
      description: "For large teams and organizations",
      features: [
        "Unlimited URLs",
        "Advanced reporting",
        "Multiple custom domains",
        "24/7 premium support",
        "White-label solution"
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Current Plan</CardTitle>
              <Badge variant={currentPlan.name === 'Free' ? 'secondary' : 'default'}>
                {currentPlan.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{currentPlan.price}</span>
                  <span className="text-muted-foreground">/{currentPlan.period}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>URLs this month</span>
                  <span>{urlsUsed}/{currentPlan.urlLimit === Infinity ? '∞' : currentPlan.urlLimit}</span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
                {usagePercentage > 80 && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    You're approaching your monthly limit
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Plan Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage Statistics</CardTitle>
          <CardDescription>Overview of your account activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">URLs Created</p>
                <p className="text-lg font-semibold">{urlsUsed}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-full">
                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-lg font-semibold">0</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Days Left</p>
                <p className="text-lg font-semibold">
                  {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      {currentPlan.name === 'Free' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Upgrade Your Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <Card key={plan.name} className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="text-right">
                      <div className="text-xl font-bold">{plan.price}</div>
                      <div className="text-sm text-muted-foreground">{plan.period}</div>
                    </div>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-1">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {plan.features.length > 3 && (
                      <li className="text-sm text-muted-foreground">
                        +{plan.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                  <Button className="w-full" asChild>
                    <Link href="/dashboard/upgrade">
                      Upgrade to {plan.name}
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Billing Section */}
      {currentPlan.name !== 'Free' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Billing & Subscription</CardTitle>
            <CardDescription>Manage your subscription and billing information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Next billing date</p>
                <p className="text-sm text-muted-foregroundtext-sm">
                  {currentPlan.nextBillingDate 
                    ? new Date(currentPlan.nextBillingDate).toLocaleDateString()
                    : 'Not available'
                  }
                </p>
              </div>
              <Button variant="outline" disabled>Update Payment Method</Button>
            </div>
            
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="font-medium">Subscription Management</p>
                <p className="text-sm text-muted-foreground">
                  Change plan, cancel, or view billing history
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/upgrade">Change Plan</Link>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancelPlan}
                  disabled={isCancelling || isUpgrading}
                >
                  {isCancelling ? (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-2 animate-pulse" />
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Subscription'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}