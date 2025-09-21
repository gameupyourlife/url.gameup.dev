import { createServerClient, Database } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
    ArrowLeft,
    TrendingUp,
    Eye,
    Clock,
    Globe,
    BarChart3,
    Calendar,
    MousePointerClick,
    Link as LinkIcon
} from 'lucide-react'

type UrlRow = Database['public']['Tables']['urls']['Row']

export default async function AnalyticsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Fetch detailed analytics data
  const [urlsResponse, clicksToday, clicksThisWeek, clicksThisMonth] = await Promise.all([
    supabase
      .from('urls')
      .select('*')
      .eq('user_id', user.id)
      .order('clicks', { ascending: false }),
    
    // Today's clicks - simplified for now since we don't have detailed click tracking
    supabase
      .from('urls')
      .select('clicks, created_at')
      .eq('user_id', user.id)
      .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    
    // This week's data
    supabase
      .from('urls')
      .select('clicks, created_at')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    
    // This month's data  
    supabase
      .from('urls')
      .select('clicks, created_at')
      .eq('user_id', user.id)
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
  ])

  const urls = (urlsResponse.data || []) as UrlRow[]
  const totalUrls = urls.length
  const totalClicks = urls.reduce((total, url) => total + url.clicks, 0)
  const activeUrls = urls.filter(url => url.is_active).length

  // Calculate time-based stats
  const todayClicks = ((clicksToday.data || []) as UrlRow[]).reduce((total, url) => total + url.clicks, 0)
  const weekClicks = ((clicksThisWeek.data || []) as UrlRow[]).reduce((total, url) => total + url.clicks, 0)
  const monthClicks = ((clicksThisMonth.data || []) as UrlRow[]).reduce((total, url) => total + url.clicks, 0)

  // Top performing URLs
  const topUrls = urls.slice(0, 5)

  // Recent URLs
  const recentUrls = [...urls]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h2 className="text-2xl font-bold leading-7  sm:truncate sm:text-3xl sm:tracking-tight">
                Analytics
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Detailed insights into your URL performance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total URLs</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUrls}</div>
            <p className="text-xs text-muted-foreground">
              {activeUrls} active, {totalUrls - activeUrls} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              All time clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalUrls > 0 ? Math.round(totalClicks / totalUrls) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Clicks per URL
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Performer</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topUrls.length > 0 ? topUrls[0].clicks : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Highest clicks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time-based Analytics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayClicks}</div>
            <p className="text-xs text-muted-foreground">
              Clicks today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekClicks}</div>
            <p className="text-xs text-muted-foreground">
              Clicks this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthClicks}</div>
            <p className="text-xs text-muted-foreground">
              Clicks this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing URLs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Top Performing URLs</span>
          </CardTitle>
          <CardDescription>
            Your most clicked shortened URLs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topUrls.length > 0 ? (
            <div className="space-y-4">
              {topUrls.map((url, index) => (
                <div key={url.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-semibold text-sm">
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium  truncate">
                          /{url.short_code}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {url.original_url}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={url.is_active ? "default" : "secondary"}>
                      {url.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-semibold ">
                        {url.clicks} clicks
                      </p>
                      <p className="text-xs text-gray-500">
                        Created {new Date(url.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No URLs created yet. <Link href="/dashboard" className="text-blue-600 hover:underline">Create your first URL</Link>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent URLs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Recent URLs</span>
          </CardTitle>
          <CardDescription>
            Your most recently created URLs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentUrls.length > 0 ? (
            <div className="space-y-4">
              {recentUrls.map((url) => (
                <div key={url.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium  truncate">
                      /{url.short_code}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {url.original_url}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={url.is_active ? "default" : "secondary"}>
                      {url.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-semibold ">
                        {url.clicks} clicks
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(url.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No URLs created yet. <Link href="/dashboard" className="text-blue-600 hover:underline">Create your first URL</Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}