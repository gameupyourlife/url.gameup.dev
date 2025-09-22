'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePlan } from '@/lib/plan-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  CreditCard,
  Shield,
  Check,
  Lock,
  Zap,
  Calendar,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const plans = {
  developer: {
    name: "Developer",
    price: 19,
    period: "month",
    description: "Perfect for growing businesses and power users",
    features: [
      "5,000 URLs per month",
      "Advanced analytics & insights", 
      "Custom branded domains",
      "API access with 10,000 requests/month",
      "Priority email support"
    ]
  },
  enterprise: {
    name: "Enterprise", 
    price: 99,
    period: "month",
    description: "For large teams and organizations",
    features: [
      "Unlimited URLs",
      "Advanced reporting & exports",
      "Multiple custom domains", 
      "Unlimited API requests",
      "24/7 premium support",
      "Team collaboration tools"
    ]
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planParam = searchParams.get('plan')
  const { upgradePlan, isUpgrading } = usePlan()
  
  const [selectedPlan, setSelectedPlan] = useState(planParam || 'developer')
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    country: 'US'
  })

  const plan = plans[selectedPlan as keyof typeof plans]
  const yearlyDiscount = 0.2 // 20% discount for yearly
  const finalPrice = billingCycle === 'yearly' 
    ? Math.round(plan.price * 12 * (1 - yearlyDiscount))
    : plan.price

  useEffect(() => {
    if (planParam && plans[planParam as keyof typeof plans]) {
      setSelectedPlan(planParam)
    }
  }, [planParam])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Upgrade the plan using context
      await upgradePlan(selectedPlan, billingCycle === 'yearly' ? 'year' : 'month')
      
      toast.success(`Successfully subscribed to ${plan.name} plan!`)
      
      // Redirect to dashboard with success message
      router.push('/dashboard/profile?upgraded=true')
    } catch (error) {
      console.error('Payment failed:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const isFormValid = formData.email && formData.cardNumber && formData.expiryDate && formData.cvv && formData.name

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/upgrade">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Complete Your Purchase</h1>
            <p className="text-muted-foreground">
              Secure checkout powered by industry-leading encryption
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Plan Selection */}
                <div className="space-y-3">
                  <Label>Select Plan</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(plans).map(([key, planOption]) => (
                      <div 
                        key={key}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          selectedPlan === key 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPlan(key)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{planOption.name}</p>
                            <p className="text-sm text-muted-foreground">{planOption.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${planOption.price}</p>
                            <p className="text-sm text-muted-foreground">per month</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billing Cycle */}
                <div className="space-y-3">
                  <Label>Billing Cycle</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={billingCycle === 'monthly' ? 'default' : 'outline'}
                      onClick={() => setBillingCycle('monthly')}
                      className="justify-start"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Monthly
                    </Button>
                    <Button
                      variant={billingCycle === 'yearly' ? 'default' : 'outline'}
                      onClick={() => setBillingCycle('yearly')}
                      className="justify-start"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Yearly
                      <Badge variant="secondary" className="ml-2">Save 20%</Badge>
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{plan.name} Plan</span>
                    <span>${plan.price}/{billingCycle === 'yearly' ? 'month' : 'month'}</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Billed annually</span>
                        <span>${plan.price * 12}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Yearly discount (20%)</span>
                        <span>-${Math.round(plan.price * 12 * yearlyDiscount)}</span>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>
                      ${finalPrice}
                      {billingCycle === 'yearly' ? '/year' : '/month'}
                    </span>
                  </div>
                </div>

                {/* Features Included */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">What's included:</h4>
                  <ul className="space-y-1">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    <li className="text-sm text-muted-foreground">
                      +{plan.features.length - 3} more features
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
                <CardDescription>
                  Your payment information is encrypted and secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  {/* Card Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Shield className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your payment is secured with 256-bit SSL encryption
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={!isFormValid || isProcessing || isUpgrading}
                  >
                    {(isProcessing || isUpgrading) ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Complete Purchase - ${finalPrice}
                        {billingCycle === 'yearly' ? '/year' : '/month'}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                    You can cancel anytime from your account settings.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}