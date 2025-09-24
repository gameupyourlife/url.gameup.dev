/**
 * Analytics utilities for URL shortener
 * Provides functions to extract, process, and format analytics data
 */

import { userAgent } from 'next/server'
import { createServerClient } from './supabase'

export interface AnalyticsData {
  timestamp: string
  shortCode: string
  ip: string
  userAgent: string
  referer: string
  host: string
  device: {
    type: string
    vendor: string
    model: string
  }
  browser: {
    name: string
    version: string
  }
  os: {
    name: string
    version: string
  }
  engine: {
    name: string
    version: string
  }
  cpu: {
    architecture: string
  }
  acceptLanguage: string
  acceptEncoding: string
  dnt: string
  cfCountry: string
  cfRay: string
  isBot: boolean
  searchParams: Record<string, string>
  country?: {
    code: string
    name: string
  }
}

export interface EnhancedAnalyticsData extends AnalyticsData {
  urlData: {
    id: string
    originalUrl: string
    title: string | null
    currentClicks: number
    userId: string | null
    urlCreatedAt: string
    urlAge: number
  }
}

export interface ClickData {
  url_id: string
  short_code: string
  ip_address: string | null
  user_agent: string | null
  referer: string | null
  host: string | null
  device_type: string | null
  device_vendor: string | null
  device_model: string | null
  browser_name: string | null
  browser_version: string | null
  os_name: string | null
  os_version: string | null
  engine_name: string | null
  engine_version: string | null
  cpu_architecture: string | null
  country_code: string | null
  country_name: string | null
  cf_country: string | null
  cf_ray: string | null
  accept_language: string | null
  accept_encoding: string | null
  dnt: string | null
  is_bot: boolean
  search_params: Record<string, string> | null
  referer_domain: string | null
  referer_type: string | null
  referer_source: string | null
  clicked_at: string
}

/**
 * Extract comprehensive analytics data from a request
 */
export function extractAnalyticsData(request: Request, shortCode: string): AnalyticsData {
  const agent = userAgent(request)
  const url = new URL(request.url)
  
  return {
    timestamp: new Date().toISOString(),
    shortCode,
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    referer: request.headers.get('referer') || 'direct',
    host: request.headers.get('host') || 'unknown',
    
    // Device info from Next.js userAgent
    device: {
      type: agent.device?.type || 'unknown',
      vendor: agent.device?.vendor || 'unknown',
      model: agent.device?.model || 'unknown'
    },
    
    // Browser info
    browser: {
      name: agent.browser?.name || 'unknown',
      version: agent.browser?.version || 'unknown'
    },
    
    // OS info  
    os: {
      name: agent.os?.name || 'unknown',
      version: agent.os?.version || 'unknown'
    },
    
    // Engine info
    engine: {
      name: agent.engine?.name || 'unknown',
      version: agent.engine?.version || 'unknown'
    },
    
    // CPU info
    cpu: {
      architecture: agent.cpu?.architecture || 'unknown'
    },
    
    // Additional headers for analytics
    acceptLanguage: request.headers.get('accept-language') || 'unknown',
    acceptEncoding: request.headers.get('accept-encoding') || 'unknown',
    dnt: request.headers.get('dnt') || 'not-set', // Do Not Track
    
    // Cloudflare specific headers (if using Cloudflare)
    cfCountry: request.headers.get('cf-ipcountry') || 'unknown',
    cfRay: request.headers.get('cf-ray') || 'unknown',
    
    // Is this likely a bot?
    isBot: agent.isBot || false,
    
    // URL parameters
    searchParams: Object.fromEntries(url.searchParams.entries())
  }
}

/**
 * Extract comprehensive analytics data from a request (async version with country lookup)
 */
export async function extractAnalyticsDataWithCountry(request: Request, shortCode: string): Promise<AnalyticsData> {
  const baseAnalytics = extractAnalyticsData(request, shortCode)
  
  // Try to get country from API
  const country = await getCountryFromIP(baseAnalytics.ip)
  
  return {
    ...baseAnalytics,
    country: country || undefined
  }
}

/**
 * Get client IP from various headers
 */
export function getClientIP(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         request.headers.get('x-real-ip') ||
         request.headers.get('cf-connecting-ip') ||
         request.headers.get('x-client-ip') ||
         request.headers.get('x-forwarded') ||
         request.headers.get('forwarded-for') ||
         request.headers.get('forwarded') ||
         'unknown'
}

/**
 * Fetch country data from IP using country.is API
 */
export async function getCountryFromIP(ip: string): Promise<{ code: string; name: string } | null> {
  // Skip if IP is unknown or localhost
  if (!ip || ip === 'unknown' || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return null
  }
  
  try {
    console.log(`🌍 Fetching country for IP: ${ip}`)
    const response = await fetch(`https://api.country.is/${ip}`, {
      headers: {
        'User-Agent': 'URL-Shortener-Analytics/1.0'
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(3000)
    })
    
    if (!response.ok) {
      console.warn(`⚠️ Country API returned ${response.status} for IP ${ip}`)
      return null
    }
    
    const data = await response.json() as { country: string; ip: string }
    
    // Convert country code to country name (basic mapping)
    const countryNames: Record<string, string> = {
      'US': 'United States',
      'CA': 'Canada',
      'GB': 'United Kingdom',
      'DE': 'Germany',
      'FR': 'France',
      'JP': 'Japan',
      'AU': 'Australia',
      'BR': 'Brazil',
      'IN': 'India',
      'CN': 'China',
      'RU': 'Russia',
      'MX': 'Mexico',
      'IT': 'Italy',
      'ES': 'Spain',
      'NL': 'Netherlands',
      'SE': 'Sweden',
      'NO': 'Norway',
      'DK': 'Denmark',
      'FI': 'Finland',
      'CH': 'Switzerland',
      'AT': 'Austria',
      'BE': 'Belgium',
      'PL': 'Poland',
      'CZ': 'Czech Republic',
      'HU': 'Hungary',
      'PT': 'Portugal',
      'IE': 'Ireland',
      'GR': 'Greece',
      'TR': 'Turkey',
      'IL': 'Israel',
      'ZA': 'South Africa',
      'EG': 'Egypt',
      'NG': 'Nigeria',
      'KE': 'Kenya',
      'AR': 'Argentina',
      'CL': 'Chile',
      'PE': 'Peru',
      'CO': 'Colombia',
      'VE': 'Venezuela',
      'KR': 'South Korea',
      'TH': 'Thailand',
      'VN': 'Vietnam',
      'MY': 'Malaysia',
      'SG': 'Singapore',
      'ID': 'Indonesia',
      'PH': 'Philippines',
      'TW': 'Taiwan',
      'HK': 'Hong Kong',
      'NZ': 'New Zealand'
    }
    
    const countryCode = data.country.toUpperCase()
    const countryName = countryNames[countryCode] || data.country
    
    console.log(`✅ Country detected: ${countryName} (${countryCode}) for IP ${ip}`)
    
    return {
      code: countryCode,
      name: countryName
    }
  } catch (error) {
    console.error(`❌ Failed to fetch country for IP ${ip}:`, error)
    return null
  }
}

/**
 * Detect if the request is from a bot based on user agent
 */
export function isBotRequest(userAgentString: string): boolean {
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /facebook/i,
    /twitter/i,
    /linkedin/i,
    /whatsapp/i,
    /telegram/i,
    /slackbot/i,
    /discordbot/i,
    /googlebot/i,
    /bingbot/i,
    /yahoo/i,
    /baiduspider/i,
    /yandex/i,
    /duckduckbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /pinterestbot/i,
    /redditbot/i,
    /applebot/i,
    /amazonbot/i
  ]
  
  return botPatterns.some(pattern => pattern.test(userAgentString))
}

/**
 * Get device category from user agent data
 */
export function getDeviceCategory(deviceType: string | undefined): string {
  switch (deviceType?.toLowerCase()) {
    case 'mobile':
      return 'Mobile'
    case 'tablet':
      return 'Tablet'
    case 'smarttv':
      return 'Smart TV'
    case 'wearable':
      return 'Wearable'
    case 'embedded':
      return 'Embedded'
    default:
      return 'Desktop'
  }
}

/**
 * Parse referer to get domain and classify referer type
 */
export function parseReferer(referer: string): { domain: string; type: string; source: string } {
  if (!referer || referer === 'direct') {
    return { domain: 'direct', type: 'direct', source: 'direct' }
  }
  
  try {
    const url = new URL(referer)
    const domain = url.hostname.replace(/^www\./, '').toLowerCase()
    
    // Social media platforms
    const socialPlatforms = [
      'facebook.com', 'twitter.com', 'x.com', 'linkedin.com', 'instagram.com',
      'youtube.com', 'tiktok.com', 'snapchat.com', 'pinterest.com', 'reddit.com',
      'discord.com', 'telegram.org', 'whatsapp.com', 'messenger.com'
    ]
    
    // Search engines
    const searchEngines = [
      'google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com', 'baidu.com',
      'yandex.com', 'ask.com', 'aol.com', 'ecosia.org', 'startpage.com'
    ]
    
    let type = 'website'
    let source = domain
    
    if (socialPlatforms.some(platform => domain.includes(platform))) {
      type = 'social'
      source = socialPlatforms.find(platform => domain.includes(platform)) || domain
    } else if (searchEngines.some(engine => domain.includes(engine))) {
      type = 'search'
      source = searchEngines.find(engine => domain.includes(engine)) || domain
    }
    
    return { domain, type, source }
  } catch {
    return { domain: 'unknown', type: 'unknown', source: referer }
  }
}

/**
 * Format analytics data for easy logging
 */
export function formatAnalyticsForLogging(analytics: AnalyticsData | EnhancedAnalyticsData): Record<string, string | number | boolean | object | null> {
  const refererInfo = parseReferer(analytics.referer)
  
  return {
    // Basic info
    timestamp: analytics.timestamp,
    shortCode: analytics.shortCode,
    ip: analytics.ip,
    
    // Device & Browser
    device: `${getDeviceCategory(analytics.device.type)} - ${analytics.browser.name} ${analytics.browser.version}`,
    os: `${analytics.os.name} ${analytics.os.version}`,
    
    // Location & Network
    country: analytics.country?.name || analytics.cfCountry || 'unknown',
    countryCode: analytics.country?.code || analytics.cfCountry || 'unknown',
    
    // Traffic source
    referer: {
      url: analytics.referer,
      domain: refererInfo.domain,
      type: refererInfo.type,
      source: refererInfo.source
    },
    
    // Bot detection
    isBot: analytics.isBot,
    
    // Language
    language: analytics.acceptLanguage.split(',')[0]?.split('-')[0] || 'unknown',
    
    // URL data (if available)
    ...(('urlData' in analytics) && {
      urlId: analytics.urlData.id,
      originalUrl: analytics.urlData.originalUrl,
      title: analytics.urlData.title,
      clickCount: analytics.urlData.currentClicks + 1,
      urlAge: analytics.urlData.urlAge
    })
  }
}

/**
 * Log analytics with different levels and emojis for easy identification
 */

export function logAnalytics(type: 'click' | 'error' | 'notFound', data: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()
  
  switch (type) {
    case 'click':
      console.log('🔗 URL CLICK:', JSON.stringify({ timestamp, ...data }, null, 2))
      break
    case 'error':
      console.error('🚨 URL ERROR:', JSON.stringify({ timestamp, ...data }, null, 2))
      break
    case 'notFound':
      console.warn('❌ URL NOT FOUND:', JSON.stringify({ timestamp, ...data }, null, 2))
      break
  }
}

/**
 * Save click analytics to the database
 */
export async function saveClickAnalytics(
  analytics: EnhancedAnalyticsData,
  urlId: string
): Promise<boolean> {
  try {
    const supabase = await createServerClient()
    const refererInfo = parseReferer(analytics.referer)
    
    const clickData: ClickData = {
      url_id: urlId,
      short_code: analytics.shortCode,
      
      // Request info
      ip_address: analytics.ip !== 'unknown' ? analytics.ip : null,
      user_agent: analytics.userAgent !== 'unknown' ? analytics.userAgent : null,
      referer: analytics.referer !== 'direct' ? analytics.referer : null,
      host: analytics.host !== 'unknown' ? analytics.host : null,
      
      // Device info
      device_type: analytics.device.type !== 'unknown' ? analytics.device.type : null,
      device_vendor: analytics.device.vendor !== 'unknown' ? analytics.device.vendor : null,
      device_model: analytics.device.model !== 'unknown' ? analytics.device.model : null,
      
      // Browser info
      browser_name: analytics.browser.name !== 'unknown' ? analytics.browser.name : null,
      browser_version: analytics.browser.version !== 'unknown' ? analytics.browser.version : null,
      
      // OS info
      os_name: analytics.os.name !== 'unknown' ? analytics.os.name : null,
      os_version: analytics.os.version !== 'unknown' ? analytics.os.version : null,
      
      // Engine info
      engine_name: analytics.engine.name !== 'unknown' ? analytics.engine.name : null,
      engine_version: analytics.engine.version !== 'unknown' ? analytics.engine.version : null,
      
      // CPU info
      cpu_architecture: analytics.cpu.architecture !== 'unknown' ? analytics.cpu.architecture : null,
      
      // Location info
      country_code: analytics.country?.code || null,
      country_name: analytics.country?.name || null,
      cf_country: analytics.cfCountry !== 'unknown' ? analytics.cfCountry : null,
      cf_ray: analytics.cfRay !== 'unknown' ? analytics.cfRay : null,
      
      // Additional headers
      accept_language: analytics.acceptLanguage !== 'unknown' ? analytics.acceptLanguage : null,
      accept_encoding: analytics.acceptEncoding !== 'unknown' ? analytics.acceptEncoding : null,
      dnt: analytics.dnt !== 'not-set' ? analytics.dnt : null,
      
      // Analytics flags
      is_bot: analytics.isBot,
      
      // URL search parameters
      search_params: Object.keys(analytics.searchParams).length > 0 ? analytics.searchParams : null,
      
      // Referer analysis
      referer_domain: refererInfo.domain !== 'direct' && refererInfo.domain !== 'unknown' ? refererInfo.domain : null,
      referer_type: refererInfo.type !== 'unknown' ? refererInfo.type : null,
      referer_source: refererInfo.source !== 'direct' && refererInfo.source !== 'unknown' ? refererInfo.source : null,
      
      // Timestamp
      clicked_at: analytics.timestamp
    }
    
    const { error } = await supabase
      .from('clicks')
      .insert(clickData as never)
    
    if (error) {
      console.error('❌ Failed to save click analytics:', error)
      return false
    }
    
    console.log('💾 Click analytics saved successfully')
    return true
  } catch (error) {
    console.error('❌ Error saving click analytics:', error)
    return false
  }
}

/**
 * Save click analytics asynchronously (non-blocking)
 */
export function saveClickAnalyticsAsync(
  analytics: EnhancedAnalyticsData,
  urlId: string
): void {
  // Run async without awaiting to avoid blocking the response
  saveClickAnalytics(analytics, urlId).catch(error => {
    console.error('❌ Async click analytics save failed:', error)
  })
}