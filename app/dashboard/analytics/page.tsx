import { getOverallAnalytics } from "@/lib/analytics-service"
import { UnifiedAnalytics } from "@/components/unified-analytics"
import { Card, CardContent } from "@/components/ui/card"
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

  const topCountries = analytics.topCountries.map((country: { country: string; clicks: number }) => ({
    name: country.country,
    clicks: country.clicks
  }))

  const topBrowsers = analytics.topBrowsers.map((browser: { browser: string; clicks: number }) => ({
    name: browser.browser,
    clicks: browser.clicks
  }))

  const topDevices = analytics.topDevices.map((device: { device: string; clicks: number }) => ({
    name: device.device,
    clicks: device.clicks
  }))

  const topLanguages = analytics.topLanguages.map((language: { language: string; clicks: number }) => ({
    name: language.language,
    clicks: language.clicks
  }))

  const referrerTypes = analytics.referrerTypes.map((type: { type: string; clicks: number }) => ({
    name: type.type,
    clicks: type.clicks
  }))

  const referrerDomains = analytics.referrerDomains.map((domain: { domain: string; clicks: number }) => ({
    name: domain.domain,
    clicks: domain.clicks
  }))

  const referrerSources = analytics.referrerSources.map((source: { source: string; clicks: number }) => ({
    name: source.source,
    clicks: source.clicks
  }))

  return (
    <UnifiedAnalytics
      type="global"
      title="Analytics"
      subtitle="Comprehensive insights into your URL performance"
      overviewStats={{
        totalClicks: analytics.totalClicks,
        totalUrls: analytics.totalUrls,
        thisWeekClicks: analytics.thisWeekClicks,
        thisMonthClicks: analytics.thisMonthClicks
      }}
      countryData={countryChartData}
      topCountries={topCountries}
      topBrowsers={topBrowsers}
      topDevices={topDevices}
      topLanguages={topLanguages}
      referrerTypes={referrerTypes}
      referrerDomains={referrerDomains}
      referrerSources={referrerSources}
    />
  )
}