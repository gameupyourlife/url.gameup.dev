import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnalyticsCharts } from '@/components/analytics-charts'
import { WorldMap } from '@/components/world-map'
import { ClickTrendsChart } from '@/components/click-trends-chart'
import {
    Calendar,
    Globe,
    MapPin,
    Monitor,
    MousePointer,
    Smartphone,
    Users,
    Bot, Copy,
    ExternalLink,
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface CountryData {
    code: string
    name: string
    count: number
}

interface OverviewStats {
    totalClicks: number
    humanClicks?: number
    botClicks?: number
    totalUrls?: number
    uniqueCountries?: number
    thisWeekClicks?: number
    thisMonthClicks?: number
}

interface TopListItem {
    name: string
    clicks: number
}

interface UrlInfo {
    id: string
    shortCode: string
    originalUrl: string
    title?: string | null
    isActive?: boolean
    createdAt?: string
}

interface RecentClick {
    id: string
    clickedAt: string
    countryCode?: string | null
    countryName?: string | null
    isBot?: boolean
}

interface UnifiedAnalyticsProps {
    // Page type
    type: 'global' | 'individual'

    // Data
    overviewStats: OverviewStats
    countryData: CountryData[]
    topCountries: TopListItem[]
    topBrowsers: TopListItem[]
    topDevices: TopListItem[]
    topLanguages?: TopListItem[]
    referrerTypes?: TopListItem[]
    referrerDomains?: TopListItem[]
    referrerSources?: TopListItem[]
    recentClicks?: RecentClick[]
    clicksByDay?: Array<{ date: string; mobile: number; desktop: number; tablet: number; unknown: number; total: number }>

    // Individual link specific
    urlInfo?: UrlInfo

    // Page metadata
    title: string
    subtitle: string
}

export function UnifiedAnalytics({
    type,
    overviewStats,
    countryData,
    topCountries,
    topBrowsers,
    topDevices,
    topLanguages = [],
    referrerTypes = [],
    referrerDomains = [],
    referrerSources = [],
    recentClicks = [],
    clicksByDay = [],
    urlInfo,
    title,
    subtitle
}: UnifiedAnalyticsProps) {
    const {
        totalClicks,
        humanClicks,
        botClicks,
        totalUrls,
        uniqueCountries,
        thisWeekClicks,
        thisMonthClicks
    } = overviewStats

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    {type === 'individual' && (
                        <div className="flex items-center gap-2 mb-4">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Dashboard
                                </Link>
                            </Button>
                        </div>
                    )}
                    <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                    <p className="text-muted-foreground">{subtitle}</p>
                </div>
            </div>

            {/* URL Info for individual links */}
            {type === 'individual' && urlInfo && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 flex-wrap">
                                <code className="bg-muted px-2 py-1 rounded text-sm">{urlInfo.shortCode}</code>
                                <Button variant="ghost" size="sm">
                                    <Copy className="w-4 h-4" />
                                </Button>
                                {urlInfo.isActive !== undefined && (
                                    <Badge variant="secondary">
                                        {urlInfo.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <ExternalLink className="w-4 h-4" />
                                <span className="truncate max-w-md">{urlInfo.originalUrl}</span>
                            </div>
                            {urlInfo.title && (
                                <div className="flex items-center gap-2 text-foreground">
                                    <span className="font-medium">{urlInfo.title}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Overview Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                        <MousePointer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalClicks}</div>
                        <p className="text-xs text-muted-foreground">
                            {type === 'global' ? 'All time clicks across all URLs' : 'All time clicks'}
                        </p>
                    </CardContent>
                </Card>

                {type === 'global' && totalUrls !== undefined && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total URLs</CardTitle>
                            <Globe className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalUrls}</div>
                            <p className="text-xs text-muted-foreground">
                                Total shortened URLs created
                            </p>
                        </CardContent>
                    </Card>
                )}

                {type === 'individual' && humanClicks !== undefined && (
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
                )}

                {type === 'global' && thisWeekClicks !== undefined && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Week</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{thisWeekClicks}</div>
                            <p className="text-xs text-muted-foreground">
                                Clicks in the past 7 days
                            </p>
                        </CardContent>
                    </Card>
                )}

                {type === 'individual' && uniqueCountries !== undefined && (
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
                )}

                {type === 'global' && thisMonthClicks !== undefined && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Month</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{thisMonthClicks}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="font-medium">{thisWeekClicks}</span> this week
                            </p>
                        </CardContent>
                    </Card>
                )}

                {type === 'individual' && botClicks !== undefined && (
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
                )}
            </div>

            {/* Technology & Demographics Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Technology & Demographics</h2>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="h-5 w-5" />
                                Top Browsers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {topBrowsers.length > 0 ? (
                                <div className="space-y-3">
                                    {topBrowsers.slice(0, 5).map((browser, index) => (
                                        <div key={browser.name} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                                                <span className="font-medium">{browser.name}</span>
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
                            {topDevices.length > 0 ? (
                                <div className="space-y-3">
                                    {topDevices.slice(0, 5).map((device, index) => (
                                        <div key={device.name} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                                                <span className="font-medium">{device.name}</span>
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

                    {/* Top Languages */}
                    {topLanguages.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    Languages
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {topLanguages.slice(0, 5).map((language, index) => (
                                        <div key={language.name} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                                                <span className="font-medium">{language.name}</span>
                                            </div>
                                            <Badge variant="secondary">{language.clicks} clicks</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Top Countries
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {topCountries.length > 0 ? (
                                <div className="space-y-3">
                                    {topCountries.slice(0, 5).map((country, index) => (
                                        <div key={country.name} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                                                <span className="font-medium">{country.name}</span>
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
                </div>
            </div>

            {/* Traffic Sources Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Traffic Sources</h2>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {/* Referrer Types */}
                    {referrerTypes.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Source Types
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {referrerTypes.slice(0, 5).map((type, index) => (
                                        <div key={type.name} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                                                <span className="font-medium">{type.name}</span>
                                            </div>
                                            <Badge variant="secondary">{type.clicks} clicks</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Top Referrer Domains */}
                    {referrerDomains.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ExternalLink className="h-5 w-5" />
                                    Top Domains
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {referrerDomains.slice(0, 5).map((domain, index) => (
                                        <div key={domain.name} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                                                <span className="font-medium text-sm">{domain.name}</span>
                                            </div>
                                            <Badge variant="secondary">{domain.clicks} clicks</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Top Referrer Sources */}
                    {referrerSources.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ArrowLeft className="h-5 w-5" />
                                    Top Sources
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {referrerSources.slice(0, 5).map((source, index) => (
                                        <div key={source.name} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                                                <span className="font-medium text-sm">{source.name}</span>
                                            </div>
                                            <Badge variant="secondary">{source.clicks} clicks</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Traffic Analysis Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Traffic Analysis</h2>
                </div>

                

                {/* Analytics Charts */}
                {countryData.length > 0 && (

                    <AnalyticsCharts
                        countryData={countryData}
                        totalClicks={totalClicks}
                        botClicks={botClicks || 0}
                    />
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
                        <div className="h-fit">
                            <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded" />}>
                                <WorldMap countryData={countryData} />
                            </Suspense>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Click Trends - Only for individual links */}
            {type === 'individual' && recentClicks.length > 0 && (
                <ClickTrendsChart clicksByDay={clicksByDay || []} />
            )}
        </div>
    )
}