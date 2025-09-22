'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface PlanData {
  id: string
  name: 'Free' | 'Developer' | 'Enterprise'
  price: number
  period: 'month' | 'year'
  urlLimit: number
  features: string[]
  isActive: boolean
  subscriptionDate?: string
  nextBillingDate?: string
}

interface PlanContextType {
  currentPlan: PlanData
  setPlan: (plan: PlanData) => void
  upgradePlan: (planName: string, billingCycle: string) => Promise<void>
  cancelPlan: () => Promise<void>
  isUpgrading: boolean
}

const defaultFreePlan: PlanData = {
  id: 'free',
  name: 'Free',
  price: 0,
  period: 'month',
  urlLimit: 100,
  features: [
    '100 URLs per month',
    'Basic analytics',
    'Standard support'
  ],
  isActive: true
}

const planConfigs = {
  developer: {
    id: 'developer',
    name: 'Developer' as const,
    price: 19,
    urlLimit: 5000,
    features: [
      '5,000 URLs per month',
      'Advanced analytics & insights',
      'Custom branded domains',
      'API access with 10,000 requests/month',
      'Priority email support',
      'Bulk URL creation',
      'Custom link expiration',
      'UTM parameter automation'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise' as const,
    price: 99,
    urlLimit: Infinity,
    features: [
      'Unlimited URLs',
      'Advanced reporting & exports',
      'Multiple custom domains',
      'Unlimited API requests',
      '24/7 premium support',
      'Team collaboration tools',
      'Single Sign-On (SSO)',
      'White-label solution',
      'Advanced security features',
      'Custom integrations'
    ]
  }
}

const PlanContext = createContext<PlanContextType | undefined>(undefined)

export function PlanProvider({ children }: { children: ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState<PlanData>(defaultFreePlan)
  const [isUpgrading, setIsUpgrading] = useState(false)

  // Load plan from localStorage on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem('userPlan')
    if (savedPlan) {
      try {
        const parsedPlan = JSON.parse(savedPlan)
        setCurrentPlan(parsedPlan)
      } catch (error) {
        console.error('Error loading plan from localStorage:', error)
      }
    }
  }, [])

  // Save plan to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userPlan', JSON.stringify(currentPlan))
  }, [currentPlan])

  const setPlan = (plan: PlanData) => {
    setCurrentPlan(plan)
  }

  const upgradePlan = async (planName: string, billingCycle: string = 'month') => {
    setIsUpgrading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const planKey = planName.toLowerCase() as keyof typeof planConfigs
      const planConfig = planConfigs[planKey]
      
      if (!planConfig) {
        throw new Error('Invalid plan selected')
      }

      const newPlan: PlanData = {
        ...planConfig,
        period: billingCycle as 'month' | 'year',
        price: billingCycle === 'year' ? Math.round(planConfig.price * 12 * 0.8) : planConfig.price,
        isActive: true,
        subscriptionDate: new Date().toISOString(),
        nextBillingDate: new Date(Date.now() + (billingCycle === 'year' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
      }

      setCurrentPlan(newPlan)
      
      // Simulate successful upgrade
      return Promise.resolve()
    } catch (error) {
      console.error('Upgrade failed:', error)
      throw error
    } finally {
      setIsUpgrading(false)
    }
  }

  const cancelPlan = async () => {
    setIsUpgrading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Reset to free plan
      setCurrentPlan(defaultFreePlan)
      
      return Promise.resolve()
    } catch (error) {
      console.error('Cancellation failed:', error)
      throw error
    } finally {
      setIsUpgrading(false)
    }
  }

  return (
    <PlanContext.Provider value={{
      currentPlan,
      setPlan,
      upgradePlan,
      cancelPlan,
      isUpgrading
    }}>
      {children}
    </PlanContext.Provider>
  )
}

export function usePlan() {
  const context = useContext(PlanContext)
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider')
  }
  return context
}