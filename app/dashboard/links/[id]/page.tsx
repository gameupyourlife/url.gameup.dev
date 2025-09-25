import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ExternalLink, Copy, Globe, Users, Clock, Bot, MousePointer } from 'lucide-react'
import Link from 'next/link'
import { WorldMap } from '@/components/world-map'
import { AnalyticsCharts } from '@/components/analytics-charts'

interface LinkAnalyticsPageProps {
  params: Promise<{ id: string }>
}

interface UrlData {
  id: string
  short_code: string
  original_url: string
  is_active: boolean
  title: string | null
  clicks: number
  created_at: string
}

interface ClickData {
  id: string
  clicked_at: string
  country_code: string | null
  country_name: string | null
  is_bot: boolean
}

export default async function LinkAnalyticsPage({ params }: LinkAnalyticsPageProps) {
  const { id } = await params
  
  const supabase = await createServerClient()
  
  // Get URL data
  const { data: urlData, error: urlError } = await supabase
    .from('urls')
    .select('*')
    .eq('id', id)
    .single()
  
  if (urlError || !urlData) {
    redirect('/dashboard')
  }
  
  const typedUrlData = urlData as UrlData
  
  // Get basic click stats
  const { data: clickStats } = await supabase
    .from('clicks')
    .select('id, clicked_at, country_code, country_name, is_bot')
    .eq('url_id', id)
    .order('clicked_at', { ascending: false })
  
  const typedClickStats = (clickStats as ClickData[]) || []
  
  const totalClicks = typedClickStats.length || 0
  const uniqueCountries = [...new Set(typedClickStats.map(c => c.country_code).filter(Boolean))].length
  const botClicks = typedClickStats.filter(c => c.is_bot).length || 0
  const humanClicks = totalClicks - botClicks

  // Prepare country data for the world map
  const countryData = typedClickStats.reduce((acc, click) => {
    if (click.country_code && click.country_name) {
      const existing = acc.find(c => c.code === click.country_code)
      if (existing) {
        existing.count++
      } else {
        acc.push({
          code: click.country_code,
          name: click.country_name,
          count: 1
        })
      }
    }
    return acc
  }, [] as { code: string; name: string; count: number }[])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold text-foreground">Link Analytics</h1>
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <code className="bg-muted px-2 py-1 rounded text-sm">{typedUrlData.short_code}</code>
            <Button variant="ghost" size="sm">
              <Copy className="w-4 h-4" />
            </Button>
            <Badge variant="secondary">
              {typedUrlData.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ExternalLink className="w-4 h-4" />
            <span className="truncate max-w-md">{typedUrlData.original_url}</span>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Human Clicks</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{humanClicks}</div>
            <p className="text-xs text-muted-foreground">
              Non-bot clicks
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCountries}</div>
            <p className="text-xs text-muted-foreground">
              Unique countries
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bot Traffic</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{botClicks}</div>
            <p className="text-xs text-muted-foreground">
              {totalClicks > 0 ? Math.round((botClicks / totalClicks) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* World Map and Analytics */}
      <div className="grid grid-cols-1 gap-8">
        {/* World Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>
              Countries where your link has been clicked
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded" />}>
              <WorldMap countryData={countryData} className="p-4" />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Top Countries - Moved to separate section */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries (Detailed)</CardTitle>
            <CardDescription>
              Complete breakdown by country
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {typedClickStats && typedClickStats.length > 0 ? (
                (() => {
                  const countryCounts = typedClickStats.reduce((acc, click) => {
                    if (click.country_code && click.country_name) {
                      const key = click.country_code
                      if (!acc[key]) {
                        acc[key] = { code: click.country_code, name: click.country_name, count: 0 }
                      }
                      acc[key].count++
                    }
                    return acc
                  }, {} as Record<string, { code: string, name: string, count: number }>)
                  
                  return Object.values(countryCounts)
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10)
                    .map((country) => (
                      <div key={country.code} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{country.code}</div>
                          <span className="font-medium">{country.name}</span>
                        </div>
                        <Badge variant="secondary">{country.count}</Badge>
                      </div>
                    ))
                })()
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No clicks recorded yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Browser/Device Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics Charts</CardTitle>
            <CardDescription>
              Visual breakdown of your link performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsCharts 
              countryData={countryData}
              totalClicks={totalClicks}
              botClicks={botClicks}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest clicks on this link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {typedClickStats && typedClickStats.slice(0, 10).map((click) => (
              <div key={click.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {new Date(click.clicked_at).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    {click.country_name && (
                      <>
                        <span className="text-sm">{click.country_code}</span>
                        <span className="text-sm font-medium">{click.country_name}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {click.is_bot && <Badge variant="outline" className="text-xs">Bot</Badge>}
                </div>
              </div>
            ))}
          </div>
          {(!typedClickStats || typedClickStats.length === 0) && (
            <p className="text-muted-foreground text-center py-4">
              No clicks recorded yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}