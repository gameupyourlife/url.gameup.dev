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
import { Bar, Doughnut } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const { theme, resolvedTheme } = useTheme()
  const isDark = theme === 'dark' || resolvedTheme === 'dark'

  // Modern gradient color palette
  const colors = {
    primary: {
      solid: isDark ? '#60a5fa' : '#3b82f6',
      gradient: isDark ? 'rgba(96, 165, 250, 0.8)' : 'rgba(59, 130, 246, 0.8)',
      light: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)',
    },
    success: {
      solid: isDark ? '#34d399' : '#10b981',
      gradient: isDark ? 'rgba(52, 211, 153, 0.8)' : 'rgba(16, 185, 129, 0.8)',
      light: isDark ? 'rgba(52, 211, 153, 0.1)' : 'rgba(16, 185, 129, 0.1)',
    },
    danger: {
      solid: isDark ? '#f87171' : '#ef4444',
      gradient: isDark ? 'rgba(248, 113, 113, 0.8)' : 'rgba(239, 68, 68, 0.8)',
      light: isDark ? 'rgba(248, 113, 113, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    },
    purple: {
      solid: isDark ? '#a78bfa' : '#8b5cf6',
      gradient: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(139, 92, 246, 0.8)',
      light: isDark ? 'rgba(167, 139, 250, 0.1)' : 'rgba(139, 92, 246, 0.1)',
    },
    gradient: [
      isDark ? 'rgba(96, 165, 250, 0.8)' : 'rgba(59, 130, 246, 0.8)',
      isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(139, 92, 246, 0.8)',
      isDark ? 'rgba(236, 72, 153, 0.8)' : 'rgba(236, 72, 153, 0.8)',
      isDark ? 'rgba(34, 197, 94, 0.8)' : 'rgba(16, 185, 129, 0.8)',
      isDark ? 'rgba(251, 146, 60, 0.8)' : 'rgba(249, 115, 22, 0.8)',
      isDark ? 'rgba(45, 212, 191, 0.8)' : 'rgba(20, 184, 166, 0.8)',
      isDark ? 'rgba(251, 113, 133, 0.8)' : 'rgba(244, 63, 94, 0.8)',
      isDark ? 'rgba(168, 85, 247, 0.8)' : 'rgba(147, 51, 234, 0.8)',
    ]
  }

  // Enhanced theme configuration
  const chartTheme = {
    backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    borderColor: isDark ? '#4b5563' : '#e5e7eb',
    textColor: isDark ? '#f9fafb' : '#111827',
    gridColor: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.5)',
    tooltipBg: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    tooltipBorder: isDark ? '#6b7280' : '#d1d5db',
  }

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
        backgroundColor: colors.gradient,
        borderColor: colors.gradient.map(color => color.replace('0.8)', '1)')),
        borderWidth: 0,
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: colors.gradient.map(color => color.replace('0.8)', '0.9)')),
        hoverBorderWidth: 3,
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
        color: chartTheme.textColor,
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
        backgroundColor: chartTheme.tooltipBg,
        titleColor: chartTheme.textColor,
        bodyColor: chartTheme.textColor,
        borderColor: chartTheme.tooltipBorder,
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
          title: function(context) {
            return context[0].label
          },
          label: function(context) {
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
          color: chartTheme.textColor,
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
          color: chartTheme.gridColor,
          lineWidth: 1,
        },
        ticks: {
          color: chartTheme.textColor,
          font: {
            size: 12,
          },
          stepSize: 1,
          callback: function(tickValue) {
            return Number(tickValue).toLocaleString()
          },
        },
        border: {
          display: false,
        },
      },
    },
  }

  // Prepare data for bot vs human doughnut chart
  const humanClicks = totalClicks - botClicks
  const trafficData = {
    labels: ['Human Traffic', 'Bot Traffic'],
    datasets: [
      {
        data: [humanClicks, botClicks],
        backgroundColor: [
          colors.success.gradient,
          colors.danger.gradient,
        ],
        borderColor: [
          colors.success.solid,
          colors.danger.solid,
        ],
        borderWidth: 3,
        hoverOffset: 12,
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
          color: chartTheme.textColor,
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 14,
            weight: 'normal',
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
      title: {
        display: true,
        text: 'Traffic Quality Analysis',
        color: chartTheme.textColor,
        font: {
          size: 18,
          weight: 'bold',
          family: 'Inter, system-ui, sans-serif',
        },
        padding: {
          top: 0,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: chartTheme.tooltipBg,
        titleColor: chartTheme.textColor,
        bodyColor: chartTheme.textColor,
        borderColor: chartTheme.tooltipBorder,
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
          label: function(context) {
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
        <Card className="max-w-md mx-auto border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="pt-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-2">No Analytics Data Yet</h3>
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
      {/* Modern Header */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
          Analytics Overview
        </h2>
        <p className="text-lg text-muted-foreground">
          Comprehensive insights into your link performance
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Country Chart */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="h-80 relative">
              <Bar data={countryChartData} options={countryChartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Traffic Quality Chart */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="h-80 relative">
              <Doughnut data={trafficData} options={trafficOptions} />
            </div>
            
            {/* Quality Score */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-4 py-2 rounded-full border border-green-200 dark:border-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Quality Score: {totalClicks > 0 ? Math.round((humanClicks / totalClicks) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Countries</CardTitle>
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {countryData.filter(c => c.count > 0).length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Geographic reach
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Human Clicks</CardTitle>
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{humanClicks}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Quality engagement
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bot Clicks</CardTitle>
            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{botClicks}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Automated traffic
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quality Score</CardTitle>
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {totalClicks > 0 ? Math.round((humanClicks / totalClicks) * 100) : 0}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Traffic authenticity
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}