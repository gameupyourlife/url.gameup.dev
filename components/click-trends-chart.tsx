"use client";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from 'next-themes';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

interface ClickTrendsChartProps {
    clicksByDay: Array<{ date: string; clicks: number }>
}

export function ClickTrendsChart({ clicksByDay }: ClickTrendsChartProps) {
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    // Prepare data for the last 30 days
    const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        return date.toISOString().split('T')[0]
    })

    const chartData = last30Days.map(date => {
        const dayData = clicksByDay.find(d => d.date === date)
        return {
            date,
            clicks: dayData?.clicks || 0
        }
    })

    const data = {
        labels: chartData.map(d => {
            const date = new Date(d.date)
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }),
        datasets: [
            {
                label: 'Daily Clicks',
                data: chartData.map(d => d.clicks),
                borderColor: isDark ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)',
                backgroundColor: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 3,
                pointBackgroundColor: isDark ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)',
                pointBorderWidth: 0,
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                titleColor: isDark ? '#f9fafb' : '#111827',
                bodyColor: isDark ? '#f9fafb' : '#111827',
                borderColor: isDark ? '#374151' : '#d1d5db',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                    maxTicksLimit: 7,
                },
                border: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: isDark ? '#374151' : '#f3f4f6',
                },
                ticks: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                    callback: function(tickValue: string | number) {
                        return Number(tickValue).toLocaleString()
                    }
                },
                border: {
                    display: false,
                },
            },
        },
    }

    return (
        <div className="h-64">
            <Line data={data} options={options} />
        </div>
    )
}