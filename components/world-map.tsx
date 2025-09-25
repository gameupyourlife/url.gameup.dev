'use client'

import { useState, useEffect } from 'react'
import { Mercator } from '@visx/geo'
import { scaleLinear } from '@visx/scale'
import { ParentSize } from '@visx/responsive'
import { feature } from 'topojson-client'
import { FeatureCollection, Geometry } from 'geojson'
import { Globe, MapPin, TrendingUp, Activity } from 'lucide-react'

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

  // Color scale with modern gradient
  const colorScale = scaleLinear<string>({
    domain: [0, maxCount * 0.2, maxCount * 0.5, maxCount],
    range: ['#f1f5f9', '#bfdbfe', '#3b82f6', '#1e40af']
  })

  // Enhanced color scheme for better visualization
  const getIntensityLevel = (count: number) => {
    if (count === 0) return 'none'
    if (count <= maxCount * 0.2) return 'low'
    if (count <= maxCount * 0.5) return 'medium'
    if (count <= maxCount * 0.8) return 'high'
    return 'highest'
  }

  // Function to get country data by name
  const getCountryDataByName = (countryName: string) => {
    return countryData.find(country => 
      country.name.toLowerCase().includes(countryName.toLowerCase()) ||
      countryName.toLowerCase().includes(country.name.toLowerCase())
    )
  }

  // Function to get country color with enhanced gradient
  const getCountryColor = (countryName: string) => {
    const country = getCountryDataByName(countryName)
    if (!country || country.count === 0) return '#f8fafc'
    return colorScale(country.count)
  }

  // Function to get hover effects
  const getHoverStyle = (countryName: string, isHovered: boolean) => {
    const country = getCountryDataByName(countryName)
    const baseColor = getCountryColor(countryName)
    
    if (isHovered) {
      return {
        fill: baseColor,
        stroke: '#2563eb',
        strokeWidth: '2.5',
        filter: 'brightness(1.1) drop-shadow(0 4px 12px rgba(37, 99, 235, 0.25))',
      }
    }
    
    if (country && country.count > 0) {
      return {
        fill: baseColor,
        stroke: '#64748b',
        strokeWidth: '0.5',
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
      }
    }
    
    return {
      fill: baseColor,
      stroke: '#e2e8f0',
      strokeWidth: '0.3',
    }
  }

  if (!world) {
    return (
      <div className={`${className} flex items-center justify-center h-96`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center animate-pulse">
            <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Loading World Map</h3>
          <p className="text-gray-600 dark:text-gray-400">Preparing your global analytics visualization...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {/* Modern Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 mb-4">
          <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Global Click Distribution
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Interactive world map showing the geographic distribution of your link clicks
        </p>
      </div>

      {/* Enhanced World Map */}
      <div className="relative mb-8">
        <div className="bg-gradient-to-b from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
          <ParentSize>
            {({ width }) => {
              const height = Math.min(600, width * 0.65)
              
              return (
                <div className="relative">
                  <svg width={width} height={height} className="overflow-visible">
                    {/* Enhanced background */}
                    <defs>
                      <radialGradient id="oceanGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#e0f2fe" />
                        <stop offset="100%" stopColor="#bae6fd" />
                      </radialGradient>
                    </defs>
                    <rect width={width} height={height} fill="url(#oceanGradient)" rx="20" />
                    
                    <Mercator
                      data={world.features}
                      scale={width / 6.2}
                      translate={[width / 2, height / 2]}
                    >
                      {mercator => (
                        <g>
                          {mercator.features.map((feature, i) => {
                            const countryName = feature.feature.properties?.name || ''
                            const isHovered = hoveredCountry === countryName
                            const style = getHoverStyle(countryName, isHovered)
                            const countryData = getCountryDataByName(countryName)
                            
                            return (
                              <path
                                key={`map-feature-${i}`}
                                d={feature.path || ''}
                                {...style}
                                className="cursor-pointer transition-all duration-300"
                                onMouseEnter={() => setHoveredCountry(countryName)}
                                onMouseLeave={() => setHoveredCountry(null)}
                              />
                            )
                          })}
                        </g>
                      )}
                    </Mercator>
                    
                    {/* Enhanced Tooltip */}
                    {hoveredCountry && (
                      <g>
                        <rect x="20" y="20" width="240" height="80" fill="rgba(17, 24, 39, 0.95)" rx="12" />
                        <rect x="18" y="18" width="244" height="84" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="2" rx="14" />
                        <text x="35" y="45" fill="white" fontSize="16" fontWeight="bold">
                          {hoveredCountry}
                        </text>
                        <text x="35" y="65" fill="#93c5fd" fontSize="14">
                          {getCountryDataByName(hoveredCountry)?.count.toLocaleString() || 0} clicks
                        </text>
                        <text x="35" y="82" fill="#6b7280" fontSize="12">
                          {getIntensityLevel(getCountryDataByName(hoveredCountry)?.count || 0)} activity
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

      {/* Modern Legend */}
      <div className="flex justify-center items-center gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Click Intensity Scale
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-slate-100 border border-gray-300 rounded"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">No data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded" style={{ backgroundColor: colorScale(maxCount * 0.2) }}></div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded" style={{ backgroundColor: colorScale(maxCount * 0.5) }}></div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded" style={{ backgroundColor: colorScale(maxCount * 0.8) }}></div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded" style={{ backgroundColor: colorScale(maxCount) }}></div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Highest</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Top Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {countryData
          .filter(c => c.count > 0)
          .sort((a, b) => b.count - a.count)
          .slice(0, 12)
          .map((country, index) => {
            const intensity = getIntensityLevel(country.count)
            const isTopThree = index < 3
            
            return (
              <div 
                key={country.code} 
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-mono text-sm font-bold text-gray-700 dark:text-gray-300">
                        {country.code}
                      </span>
                    </div>
                    {isTopThree && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white
                        ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                          index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 
                          'bg-gradient-to-r from-orange-400 to-orange-600'}
                      `}>
                        <TrendingUp className="w-3 h-3" />
                        #{index + 1}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {country.count.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">clicks</div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate mb-1">
                    {country.name}
                  </h4>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                    ${intensity === 'highest' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      intensity === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                      intensity === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      intensity === 'low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'}
                  `}>
                    {intensity} activity
                  </div>
                </div>
                
                {/* Enhanced Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 group-hover:from-blue-600 group-hover:to-purple-600"
                      style={{ width: `${(country.count / maxCount) * 100}%` }}
                    />
                  </div>
                  
                  {/* Percentage */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">
                      {Math.round((country.count / countryData.reduce((sum, c) => sum + c.count, 0)) * 100)}% of total
                    </span>
                    <span className="text-xs text-gray-400">
                      {((country.count / maxCount) * 100).toFixed(1)}% of max
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
      </div>

      {/* Enhanced Summary Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 border border-blue-200 dark:border-blue-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {countryData.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Countries</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">in our database</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
              {countryData.reduce((sum, c) => sum + c.count, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Clicks</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">across all regions</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-1">
              {countryData.filter(c => c.count > 0).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Active Countries</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">with recorded clicks</div>
          </div>
        </div>
        
        {/* Activity Breakdown */}
        <div className="mt-8 pt-6 border-t border-blue-200 dark:border-blue-700">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
            Global Activity Distribution
          </h4>
          <div className="flex justify-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {countryData.filter(c => getIntensityLevel(c.count) === 'highest').length}
              </div>
              <div className="text-xs text-gray-500">Highest</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {countryData.filter(c => getIntensityLevel(c.count) === 'high').length}
              </div>
              <div className="text-xs text-gray-500">High</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {countryData.filter(c => getIntensityLevel(c.count) === 'medium').length}
              </div>
              <div className="text-xs text-gray-500">Medium</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {countryData.filter(c => getIntensityLevel(c.count) === 'low').length}
              </div>
              <div className="text-xs text-gray-500">Low</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}