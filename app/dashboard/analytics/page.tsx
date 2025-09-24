import { createServerClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getOverallAnalytics } from '@/lib/analytics-service'
import Link from 'next/link'
import {
  ArrowLeft, Eye,
  Clock,
  Globe, Calendar,
  MousePointerClick,
  Link as LinkIcon,
  Users,
  Smartphone,
  Monitor,
  Bot,
  ExternalLink
} from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get comprehensive analytics
  const analytics = await getOverallAnalytics(user.id)

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
            <div className="text-2xl font-bold">{analytics.totalUrls}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activeUrls} active, {analytics.totalUrls - analytics.activeUrls} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              All time clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.todayClicks}</div>
            <p className="text-xs text-muted-foreground">
              vs {analytics.yesterdayClicks} yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.thisMonthClicks}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.thisWeekClicks} this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources & Demographics */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Top Countries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topCountries.length > 0 ? (
              <div className="space-y-3">
                {analytics.topCountries.slice(0, 5).map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <span className="text-sm">{country.country}</span>
                    </div>
                    <Badge variant="outline">{country.clicks} clicks</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <span>Top Browsers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topBrowsers.length > 0 ? (
              <div className="space-y-3">
                {analytics.topBrowsers.slice(0, 5).map((browser, index) => (
                  <div key={browser.browser} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <span className="text-sm">{browser.browser}</span>
                    </div>
                    <Badge variant="outline">{browser.clicks} clicks</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Top Devices</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topDevices.length > 0 ? (
              <div className="space-y-3">
                {analytics.topDevices.slice(0, 5).map((device, index) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <span className="text-sm">{device.device}</span>
                    </div>
                    <Badge variant="outline">{device.clicks} clicks</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources & Bot Analysis */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ExternalLink className="h-5 w-5" />
              <span>Traffic Sources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.trafficSources.length > 0 ? (
              <div className="space-y-3">
                {analytics.trafficSources.slice(0, 8).map((source, index) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <div>
                        <span className="text-sm">{source.source}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {source.type}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="outline">{source.clicks} clicks</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>Traffic Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Human Traffic</span>
                </div>
                <Badge variant="outline" className="bg-green-100">
                  {analytics.botVsHuman.human} clicks
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Bot Traffic</span>
                </div>
                <Badge variant="outline" className="bg-orange-100">
                  {analytics.botVsHuman.bot} clicks
                </Badge>
              </div>

              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  Human traffic percentage: {' '}
                  {analytics.totalClicks > 0 
                    ? Math.round((analytics.botVsHuman.human / analytics.totalClicks) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Clicks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Recent Clicks</span>
          </CardTitle>
          <CardDescription>
            Latest clicks across all your URLs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentClicks.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentClicks.map((click) => (
                <div key={click.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          /{click.shortCode}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {click.originalUrl}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-xs text-gray-500 text-right">
                      <p>{click.country}</p>
                      <p>{click.browser} • {click.device}</p>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      <p>{new Date(click.clickedAt).toLocaleDateString()}</p>
                      <p>{new Date(click.clickedAt).toLocaleTimeString()}</p>
                    </div>
                    {click.isBot && (
                      <Badge variant="secondary" className="text-xs">
                        Bot
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No clicks yet. <Link href="/dashboard" className="text-blue-600 hover:underline">Create your first URL</Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}