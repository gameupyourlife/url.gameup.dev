import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import { UnifiedAnalytics } from '@/components/unified-analytics'
import { getUrlAnalytics } from '@/lib/analytics-service'

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

    // Get comprehensive analytics for chart data
    const { data: { user } } = await supabase.auth.getUser()
    let clicksByDay: Array<{ date: string; clicks: number }> = []
    
    if (user) {
        const analytics = await getUrlAnalytics(id, user.id)
        if (analytics) {
            clicksByDay = analytics.clicksByDay
        }
    }

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

    // Prepare top lists data
    const topCountries = countryData
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(c => ({ name: c.name, clicks: c.count }))

    // Group by browser (placeholder - would need real browser data)
    const topBrowsers = [
        { name: 'Chrome', clicks: Math.floor(totalClicks * 0.6) },
        { name: 'Firefox', clicks: Math.floor(totalClicks * 0.2) },
        { name: 'Safari', clicks: Math.floor(totalClicks * 0.15) },
        { name: 'Edge', clicks: Math.floor(totalClicks * 0.05) }
    ].filter(b => b.clicks > 0)

    // Group by device (placeholder - would need real device data)
    const topDevices = [
        { name: 'Mobile', clicks: Math.floor(totalClicks * 0.7) },
        { name: 'Desktop', clicks: Math.floor(totalClicks * 0.25) },
        { name: 'Tablet', clicks: Math.floor(totalClicks * 0.05) }
    ].filter(d => d.clicks > 0)

    // Prepare recent clicks for the activity feed
    const recentClicks = typedClickStats.slice(0, 10).map(click => ({
        id: click.id,
        clickedAt: click.clicked_at,
        countryCode: click.country_code,
        countryName: click.country_name,
        isBot: click.is_bot
    }))

    return (
        <UnifiedAnalytics
            type="individual"
            title="Link Analytics"
            subtitle="Detailed performance insights for this link"
            urlInfo={{
                id: typedUrlData.id,
                shortCode: typedUrlData.short_code,
                originalUrl: typedUrlData.original_url,
                title: typedUrlData.title,
                isActive: typedUrlData.is_active,
                createdAt: typedUrlData.created_at
            }}
            overviewStats={{
                totalClicks,
                humanClicks,
                botClicks,
                uniqueCountries
            }}
            countryData={countryData}
            topCountries={topCountries}
            topBrowsers={topBrowsers}
            topDevices={topDevices}
            recentClicks={recentClicks}
            clicksByDay={clicksByDay}
        />
    )
}