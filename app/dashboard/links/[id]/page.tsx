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
    let analytics: any = null
    
    if (user) {
        analytics = await getUrlAnalytics(id, user.id)
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

    // Use real analytics data if available, fallback to current data
    const topCountries = analytics?.topCountries.map((c: any) => ({ 
        name: c.country, 
        clicks: c.clicks 
    })) || countryData
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(c => ({ name: c.name, clicks: c.count }))

    // Use real browser data from analytics
    const topBrowsers = analytics?.topBrowsers.map((b: any) => ({ 
        name: b.browser, 
        clicks: b.clicks 
    })) || []

    // Extract device data from analytics clicksByDay data
    const topDevices = analytics ? (() => {
        const deviceTotals = analytics.clicksByDay.reduce((acc: any, day: any) => {
            acc.mobile = (acc.mobile || 0) + day.mobile
            acc.desktop = (acc.desktop || 0) + day.desktop
            acc.tablet = (acc.tablet || 0) + day.tablet
            acc.unknown = (acc.unknown || 0) + day.unknown
            return acc
        }, {})
        
        return Object.entries(deviceTotals)
            .filter(([_, clicks]) => (clicks as number) > 0)
            .map(([device, clicks]) => ({ 
                name: device.charAt(0).toUpperCase() + device.slice(1), 
                clicks: clicks as number 
            }))
            .sort((a, b) => b.clicks - a.clicks)
    })() : []

    // Use real recent clicks data
    const recentClicks = analytics?.recentClicks.map((click: any) => ({
        id: `${click.clickedAt}-${Math.random()}`, // Generate unique ID
        clickedAt: click.clickedAt,
        countryCode: null, // Analytics service doesn't provide country code
        countryName: click.country,
        isBot: click.isBot
    })) || typedClickStats.slice(0, 10).map(click => ({
        id: click.id,
        clickedAt: click.clicked_at,
        countryCode: click.country_code,
        countryName: click.country_name,
        isBot: click.is_bot
    }))

    // Get click trends data
    const clicksByDay = analytics?.clicksByDay || []

    // Use real language data from analytics
    const topLanguages = analytics?.topLanguages.map((l: any) => ({ 
        name: l.language, 
        clicks: l.clicks 
    })) || []

    // Use detailed referrer data from analytics
    const referrerTypes = analytics?.referrerTypes.map((r: any) => ({ 
        name: r.type, 
        clicks: r.clicks 
    })) || []

    const referrerDomains = analytics?.referrerDomains.map((r: any) => ({ 
        name: r.domain, 
        clicks: r.clicks 
    })) || []

    const referrerSources = analytics?.referrerSources.map((r: any) => ({ 
        name: r.source, 
        clicks: r.clicks 
    })) || []

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
            topLanguages={topLanguages}
            referrerTypes={referrerTypes}
            referrerDomains={referrerDomains}
            referrerSources={referrerSources}
            recentClicks={recentClicks}
            clicksByDay={clicksByDay}
        />
    )
}