'use client'

import { useState, useEffect } from 'react'
import { Mercator } from '@visx/geo'
import { scaleLinear } from '@visx/scale'
import { ParentSize } from '@visx/responsive'
import { feature } from 'topojson-client'
import { FeatureCollection, Geometry } from 'geojson'
import { Globe, MapPin } from 'lucide-react'

interface CountryData {
    code: string
    name: string
    count: number
}

interface WorldMapProps {
    countryData: CountryData[]
    className?: string
}

export function WorldMap({ countryData, className = '' }: WorldMapProps) {
    const [world, setWorld] = useState<FeatureCollection<Geometry> | null>(null)
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

    useEffect(() => {
        // Load world topology data
        import('world-atlas/countries-50m.json')
            .then((topology) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const countries = feature(topology as any, (topology as any).objects.countries) as unknown as FeatureCollection<Geometry>
                setWorld(countries)
            })
            .catch(error => {
                console.error('Failed to load world map data:', error)
                // Fallback: create a simple world structure
                setWorld({
                    type: 'FeatureCollection',
                    features: []
                })
            })
    }, [])

    // Find the maximum count for normalization
    const maxCount = Math.max(...countryData.map(c => c.count), 1)

    // Simple color scale - clean dashboard style
    const colorScale = scaleLinear<string>({
        domain: [0, maxCount * 0.3, maxCount * 0.7, maxCount],
        range: ['var(--muted)', 'var(--primary) / 0.3)', 'var(--primary) / 0.6)', 'var(--primary)']
    })

    // Function to get country data by name
    const getCountryDataByName = (countryName: string) => {
        return countryData.find(country =>
            country.name.toLowerCase().includes(countryName.toLowerCase()) ||
            countryName.toLowerCase().includes(country.name.toLowerCase())
        )
    }

    // Function to get country color - simple dashboard style
    const getCountryColor = (countryName: string) => {
        const country = getCountryDataByName(countryName)
        if (!country || country.count === 0) return 'hsl(var(--border))'
        return colorScale(country.count)
    }

    // Function to get hover effects - simple
    const getHoverStyle = (countryName: string, isHovered: boolean) => {
        const baseColor = getCountryColor(countryName)

        if (isHovered) {
            return {
                fill: baseColor,
                stroke: 'hsl(var(--foreground))',
                strokeWidth: '1.5',
            }
        }

        return {
            fill: baseColor,
            stroke: 'hsl(var(--border))',
            strokeWidth: '0.5',
        }
    }

    if (!world) {
        return (
            <div className={`${className} flex items-center justify-center h-96`}>
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-lg flex items-center justify-center">
                        <Globe className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Loading world map...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`${className}`}>
            {/* Simple World Map */}
            <div className="relative mb-6">
                <div className="bg-background border rounded-lg p-4">
                    <ParentSize>
                        {({ width }) => {
                            const height = Math.min(400, width * 0.6)

                            return (
                                <div className="relative">
                                    <svg width={width} height={height}>
                                        <Mercator
                                            data={world.features}
                                            scale={width / 6.5}
                                            translate={[width / 2, height / 2]}
                                        >
                                            {mercator => (
                                                <g>
                                                    {mercator.features.map((feature, i) => {
                                                        const countryName = feature.feature.properties?.name || ''
                                                        const isHovered = hoveredCountry === countryName
                                                        const style = getHoverStyle(countryName, isHovered)

                                                        return (
                                                            <path
                                                                key={`map-feature-${i}`}
                                                                d={feature.path || ''}
                                                                {...style}
                                                                className="cursor-pointer transition-all duration-200"
                                                                onMouseEnter={() => setHoveredCountry(countryName)}
                                                                onMouseLeave={() => setHoveredCountry(null)}
                                                            />
                                                        )
                                                    })}
                                                </g>
                                            )}
                                        </Mercator>

                                        {/* Simple Tooltip */}
                                        {hoveredCountry && (
                                            <g>
                                                <rect x="10" y="10" width="200" height="60" fill="var(--popover)" rx="6" stroke="var(--border)" strokeWidth="1" />
                                                <text x="20" y="30" fill="var(--popover-foreground)" fontSize="14" fontWeight="600">
                                                    {hoveredCountry}
                                                </text>
                                                <text x="20" y="50" fill="var(--muted-foreground)" fontSize="12">
                                                    {getCountryDataByName(hoveredCountry)?.count.toLocaleString() || 0} clicks
                                                </text>
                                            </g>
                                        )}
                                    </svg>
                                </div>
                            )
                        }}
                    </ParentSize>
                </div>
            </div>

            {/* Simple Legend */}
            <div className="flex justify-center mb-6">
                <div className="bg-background border rounded-lg p-4">
                    <div className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Click Distribution
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border rounded" style={{ backgroundColor: 'hsl(var(--border))' }}></div>
                            <span className="text-xs text-muted-foreground">No data</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: colorScale(maxCount * 0.3) }}></div>
                            <span className="text-xs text-muted-foreground">Low</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: colorScale(maxCount * 0.7) }}></div>
                            <span className="text-xs text-muted-foreground">Medium</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: colorScale(maxCount) }}></div>
                            <span className="text-xs text-muted-foreground">High</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Countries List - Simple */}
            {countryData.filter(c => c.count > 0).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {countryData
                        .filter(c => c.count > 0)
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 6)
                        .map((country, index) => (
                            <div
                                key={country.code}
                                className="bg-background border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                                        <span className="font-medium">{country.name}</span>
                                    </div>
                                    <span className="text-sm font-medium">{country.count}</span>
                                </div>
                                <div className="mt-2">
                                    <div className="w-full bg-muted rounded-full h-1.5">
                                        <div
                                            className="bg-muted-foreground h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${(country.count / maxCount) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    )
}