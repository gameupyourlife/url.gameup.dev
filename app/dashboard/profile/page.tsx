'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { usePlan } from '@/lib/plan-context'
import { DashboardPage } from '@/components/dashboard-page'
import { ProfileForm } from '@/components/profile-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Link as LinkIcon, BarChart3, TrendingUp, Eye, Copy, Settings, ArrowUpRight, Plus, Zap } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'

type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const { currentPlan } = usePlan()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUser(user)
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profile)
      }
      setLoading(false)
    }

    getUser()

    // Check for upgrade success message
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('upgraded') === 'true') {
      toast.success('🎉 Welcome to your new plan! Enjoy the enhanced features.')
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/profile')
    }
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    window.location.href = '/auth/signin'
    return null
  }

  // Mock data for demonstration
  const mockUrls = Array.from({ length: 12 }, (_, i) => ({
    id: `url-${i}`,
    original_url: `https://example.com/very-long-url-path-${i}`,
    short_code: `abc${i}`,
    clicks: Math.floor(Math.random() * 500),
    created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    title: `Example Link ${i + 1}`,
    is_active: Math.random() > 0.1, // 90% active
  }))

  const totalClicks = mockUrls.reduce((sum, url) => sum + url.clicks, 0)
  const totalUrls = mockUrls.length
  const activeUrls = mockUrls.filter(url => url.is_active).length
  const monthlyLimit = currentPlan.urlLimit
  const urlsThisMonth = 23
  const usagePercentage = currentPlan.urlLimit === Infinity ? 0 : (urlsThisMonth / monthlyLimit) * 100

  // Recent activity (last 5 URLs)
  const recentUrls = mockUrls.slice(0, 5).map(url => ({
    ...url,
    timeAgo: Math.floor((Date.now() - new Date(url.created_at).getTime()) / (1000 * 60 * 60 * 24))
  }))

  // Top performing URLs
  const topUrls = mockUrls
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 3)

  return (
    <DashboardPage 
      title="Profile"
      subtitle="Manage your profile information and view your account overview"
      headerActions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/upgrade">
              <Zap className="h-4 w-4 mr-2" />
              Upgrade
            </Link>
          </Button>
        </div>
      }
    >

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{totalUrls}</p>
                <p className="text-xs text-muted-foreground">Total URLs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Clicks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{Math.round(totalClicks / totalUrls)}</p>
                <p className="text-xs text-muted-foreground">Avg Clicks/URL</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{activeUrls}</p>
                <p className="text-xs text-muted-foreground">Active URLs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <ProfileForm user={user} profile={profile} />

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Your recently created URLs</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUrls.map((url) => (
                  <div key={url.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">
                          {url.title}
                        </p>
                        <Badge variant={url.is_active ? "default" : "secondary"} className="text-xs">
                          {url.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {url.original_url}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {url.clicks} clicks
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {url.timeAgo} days ago
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-3">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <BarChart3 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing URLs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Performing URLs</CardTitle>
              <CardDescription>Your most clicked URLs this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topUrls.map((url, index) => (
                  <div key={url.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{url.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{url.original_url}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{url.clicks.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">clicks</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Account Info & Actions */}
        <div className="space-y-6">
          {/* Monthly Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Usage</CardTitle>
              <CardDescription>URLs created this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="font-semibold">
                  {urlsThisMonth}/{currentPlan.urlLimit === Infinity ? '∞' : monthlyLimit}
                </span>
              </div>
              {currentPlan.urlLimit !== Infinity && (
                <>
                  <Progress value={usagePercentage} className="h-2" />
                  {usagePercentage > 80 && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      You&apos;re approaching your monthly limit
                    </p>
                  )}
                </>
              )}
              {currentPlan.urlLimit === Infinity && (
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  ✨ Unlimited URL creation
                </p>
              )}
              {currentPlan.name === 'Free' && (
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/dashboard/upgrade">
                      <Plus className="h-4 w-4 mr-2" />
                      Increase Limit
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Plan</CardTitle>
              <CardDescription>Your subscription details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <Badge 
                  variant={currentPlan.name === 'Free' ? 'secondary' : 'default'} 
                  className="font-semibold"
                >
                  {currentPlan.name}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">URLs/month</span>
                  <span className="text-xs font-medium">
                    {currentPlan.urlLimit === Infinity ? 'Unlimited' : currentPlan.urlLimit.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Price</span>
                  <span className="text-xs font-medium">
                    {currentPlan.price === 0 ? 'Free' : `$${currentPlan.price}/${currentPlan.period}`}
                  </span>
                </div>
                {currentPlan.nextBillingDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Next billing</span>
                    <span className="text-xs font-medium">
                      {new Date(currentPlan.nextBillingDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              
              {currentPlan.name === 'Free' ? (
                <Button className="w-full" asChild>
                  <Link href="/dashboard/upgrade">
                    <Zap className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/settings?tab=plan">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Plan
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New URL
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/settings?tab=security">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Security</CardTitle>
              <CardDescription>Security status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email Verified</span>
                <Badge variant={user.email_confirmed_at ? "default" : "destructive"}>
                  {user.email_confirmed_at ? "Verified" : "Unverified"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Two-Factor Auth</span>
                <Badge variant="secondary">Disabled</Badge>
              </div>
              
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/settings?tab=security">
                  <Settings className="h-4 w-4 mr-2" />
                  Security Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPage>
  )
}