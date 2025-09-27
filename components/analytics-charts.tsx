'use client';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    ChartOptions,
    PointElement,
    Filler,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Globe, MousePointer, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAnalyticsColors, getTrafficColors } from '@/lib/analytics-colors';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
)

interface CountryData {
    code: string
    name: string
    count: number
}

interface AnalyticsChartsProps {
    countryData: CountryData[]
    totalClicks: number
    botClicks: number
    className?: string
}

export function AnalyticsCharts({
    countryData,
    totalClicks,
    botClicks,
    className = ''
}: AnalyticsChartsProps) {
    const { resolvedTheme } = useTheme()
    const isDark = resolvedTheme === 'dark'
    const humanClicks = totalClicks - botClicks

    // Use unified color system
    const colors = getAnalyticsColors(isDark)
    const trafficColors = getTrafficColors(isDark)

    // Prepare data for country bar chart
    const topCountries = countryData
        .filter(c => c.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)

    const countryChartData = {
        labels: topCountries.map(c => c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name),
        datasets: [
            {
                label: 'Clicks',
                data: topCountries.map(c => c.count),
                backgroundColor: colors.primary,
                borderColor: colors.primary,
                borderWidth: 0,
                borderRadius: 4,
            },
        ],
    }

    const countryChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index',
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart',
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Top Countries by Clicks',
                color: colors.text,
                font: {
                    size: 18,
                    weight: 'bold',
                    family: 'Inter, system-ui, sans-serif',
                },
                padding: {
                    top: 0,
                    bottom: 30,
                },
            },
            tooltip: {
                backgroundColor: colors.background,
                titleColor: colors.text,
                bodyColor: colors.text,
                borderColor: colors.border,
                borderWidth: 1,
                cornerRadius: 12,
                padding: 16,
                displayColors: false,
                titleFont: {
                    size: 14,
                    weight: 'bold',
                },
                bodyFont: {
                    size: 13,
                },
                callbacks: {
                    title: function (context) {
                        return context[0].label
                    },
                    label: function (context) {
                        const percentage = totalClicks > 0 ? ((context.parsed.y / totalClicks) * 100).toFixed(1) : '0'
                        return `${context.parsed.y} clicks (${percentage}%)`
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: colors.textMuted,
                    font: {
                        size: 12,
                        weight: 'normal',
                    },
                    maxRotation: 45,
                },
                border: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: colors.border,
                    lineWidth: 1,
                },
                ticks: {
                    color: colors.textMuted,
                    font: {
                        size: 12,
                    },
                    stepSize: 1,
                    callback: function (tickValue) {
                        return Number(tickValue).toLocaleString()
                    },
                },
                border: {
                    display: false,
                },
            },
        },
    }

    // Traffic Quality Data
    const trafficData = {
        labels: ['Human Clicks', 'Bot Clicks'],
        datasets: [
            {
                data: [humanClicks, botClicks],
                backgroundColor: [trafficColors.human, trafficColors.bot],
                borderWidth: 0,
            },
        ],
    }

    const trafficOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1500,
            easing: 'easeInOutQuart',
        },
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: colors.text,
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 14,
                        weight: 'normal',
                        family: 'Inter, system-ui, sans-serif',
                    },
                },
                display: false,
            },
            // title: {
            //     display: true,
            //     text: 'Traffic Quality Analysis',
            //     color: chartColors.text,
            //     font: {
            //         size: 18,
            //         weight: 'bold',
            //         family: 'Inter, system-ui, sans-serif',
            //     },
            //     padding: {
            //         top: 0,
            //         bottom: 20,
            //     },
            // },
            tooltip: {
                backgroundColor: colors.background,
                titleColor: colors.text,
                bodyColor: colors.text,
                borderColor: colors.border,
                borderWidth: 1,
                cornerRadius: 12,
                padding: 16,
                displayColors: true,
                titleFont: {
                    size: 14,
                    weight: 'bold',
                },
                bodyFont: {
                    size: 13,
                },
                callbacks: {
                    label: function (context) {
                        const label = context.label || ''
                        const value = context.parsed || 0
                        const percentage = totalClicks > 0 ? ((value / totalClicks) * 100).toFixed(1) : '0'
                        return `${label}: ${value.toLocaleString()} (${percentage}%)`
                    },
                },
            },
        },
    }

    if (totalClicks === 0) {
        return (
            <div className={`${className} text-center py-16`}>
                <Card>
                    <CardContent className="pt-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Analytics Data Yet</h3>
                        <p className="text-muted-foreground">
                            Charts and insights will appear here once your link receives some clicks
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className={`${className} space-y-8`}>
            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Traffic Quality Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Traffic Quality Analysis</CardTitle>
                        <CardDescription>Human vs Bot Click Distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 h-full">
                        <div className="h-full relative">
                            <Doughnut data={trafficData} options={trafficOptions} />
                        </div>

                        {/* Quality Score */}
                        {/* <div className="mt-6 text-center">
                            <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium">
                                    Quality Score: {totalClicks > 0 ? Math.round((humanClicks / totalClicks) * 100) : 0}%
                                </span>
                            </div>
                        </div> */}
                    </CardContent>
                </Card>

                {/* Traffic Quality Cards */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Human Traffic */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Human Clicks</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalClicks - (botClicks || 0)}</div>
                            <p className="text-xs text-muted-foreground">
                                {totalClicks > 0 ? Math.round(((totalClicks - (botClicks || 0)) / totalClicks) * 100) : 0}% of total traffic
                            </p>
                        </CardContent>
                    </Card>

                    {/* Bot Traffic */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Bot Clicks</CardTitle>
                            <Bot className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{botClicks || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {totalClicks > 0 ? Math.round(((botClicks || 0) / totalClicks) * 100) : 0}% of total traffic
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Traffic */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                            <MousePointer className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalClicks || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Human and bot clicks combined
                            </p>
                        </CardContent>
                    </Card>

                    {/* Traffic Quality Score */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
                            <MousePointer className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalClicks > 0 ? Math.round(((totalClicks - (botClicks || 0)) / totalClicks) * 100) : 0}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Human interaction rate
                            </p>
                        </CardContent>
                    </Card>

                    {/* Traffic Authenticity */}
                    <Card className='lg:col-span-2'>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
                            <CardTitle className="text-sm font-medium">Authenticity</CardTitle>
                            <Globe className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className={cn("text-2xl font-bold", {
                                'text-green-500': totalClicks > 0 && (((botClicks || 0) / totalClicks) < 0.1),
                                'text-yellow-500': totalClicks > 0 && (((botClicks || 0) / totalClicks) < 0.3 && ((botClicks || 0) / totalClicks) >= 0.1),
                                'text-red-500': totalClicks > 0 && (((botClicks || 0) / totalClicks) >= 0.3)
                            })}>
                                {totalClicks > 0 && (botClicks || 0) / totalClicks < 0.1 ? 'High' :
                                    totalClicks > 0 && (botClicks || 0) / totalClicks < 0.3 ? 'Medium' : 'Low'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Traffic authenticity rating
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}