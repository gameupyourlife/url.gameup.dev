import { getOverallAnalytics } from "@/lib/analytics-service"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { WorldMap } from "@/components/world-map"
import { Calendar, Globe, MapPin, Monitor, MousePointer, Smartphone } from "lucide-react"
import { createServerClient } from "@/lib/supabase"

export default async function AnalyticsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to view analytics</div>
  }

  const analytics = await getOverallAnalytics(user.id)
  
  if (!analytics) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No analytics data available.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const countryChartData = analytics.topCountries.map((country: { country: string; clicks: number }) => ({
    code: country.country.substring(0, 2).toUpperCase(),
    name: country.country,
    count: country.clicks
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive insights into your URL performance
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              All time clicks across all URLs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total URLs</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUrls}</div>
            <p className="text-xs text-muted-foreground">
              Total shortened URLs created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.thisWeekClicks}</div>
            <p className="text-xs text-muted-foreground">
              Clicks in the past 7 days
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
              <span className="font-medium">{analytics.thisWeekClicks}</span> this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources & Demographics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topCountries.length > 0 ? (
              <div className="space-y-3">
                {analytics.topCountries.slice(0, 5).map((country: { country: string; clicks: number }, index: number) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      <span className="font-medium">{country.country}</span>
                    </div>
                    <Badge variant="secondary">{country.clicks} clicks</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Top Browsers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topBrowsers.length > 0 ? (
              <div className="space-y-3">
                {analytics.topBrowsers.slice(0, 5).map((browser: { browser: string; clicks: number }, index: number) => (
                  <div key={browser.browser} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      <span className="font-medium">{browser.browser}</span>
                    </div>
                    <Badge variant="secondary">{browser.clicks} clicks</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Top Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topDevices.length > 0 ? (
              <div className="space-y-3">
                {analytics.topDevices.slice(0, 5).map((device: { device: string; clicks: number }, index: number) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      <span className="font-medium">{device.device}</span>
                    </div>
                    <Badge variant="secondary">{device.clicks} clicks</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      {countryChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>
              Visual breakdown of your URL performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsCharts 
              countryData={countryChartData}
              totalClicks={analytics.totalClicks}
              botClicks={0}
            />
          </CardContent>
        </Card>
      )}

      {/* World Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
          <CardDescription>
            Click distribution across the world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <WorldMap countryData={countryChartData} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}