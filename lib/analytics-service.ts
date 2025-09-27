/**
 * Analytics service for fetching and processing click data
 */

import { createServerClient } from './supabase'

// Temporary types until Supabase types are updated
interface UrlRow {
  id: string
  short_code: string
  original_url: string
  title: string | null
  clicks: number
  is_active: boolean
  created_at: string
}

interface ClickRow {
  id: string
  url_id: string
  short_code: string
  country_name: string | null
  browser_name: string | null
  device_type: string | null
  referer_source: string | null
  referer_type: string | null
  referer_domain: string | null
  accept_language: string | null
  clicked_at: string
  is_bot: boolean | null
  ip_address: string | null
}

export interface ClickAnalytics {
  totalClicks: number
  totalUrls: number
  activeUrls: number
  todayClicks: number
  yesterdayClicks: number
  thisWeekClicks: number
  thisMonthClicks: number
  topCountries: Array<{ country: string; clicks: number }>
  topBrowsers: Array<{ browser: string; clicks: number }>
  topDevices: Array<{ device: string; clicks: number }>
  topReferrers: Array<{ referrer: string; clicks: number }>
  topLanguages: Array<{ language: string; clicks: number }>
  referrerTypes: Array<{ type: string; clicks: number }>
  referrerDomains: Array<{ domain: string; clicks: number }>
  referrerSources: Array<{ source: string; clicks: number }>
  recentClicks: Array<{
    id: string
    shortCode: string
    originalUrl: string
    country: string
    browser: string
    device: string
    clickedAt: string
    isBot: boolean
  }>
  clicksByDay: Array<{ date: string; mobile: number; desktop: number; tablet: number; unknown: number; total: number }>
  clicksByHour: Array<{ hour: number; clicks: number }>
  trafficSources: Array<{ source: string; type: string; clicks: number }>
  botVsHuman: { human: number; bot: number }
}

export interface UrlAnalytics {
  urlId: string
  shortCode: string
  originalUrl: string
  title: string | null
  totalClicks: number
  uniqueClicks: number
  clicksByDay: Array<{ date: string; mobile: number; desktop: number; tablet: number; unknown: number; total: number }>
  topCountries: Array<{ country: string; clicks: number }>
  topBrowsers: Array<{ browser: string; clicks: number }>
  topLanguages: Array<{ language: string; clicks: number }>
  topReferrers: Array<{ referrer: string; clicks: number }>
  referrerTypes: Array<{ type: string; clicks: number }>
  referrerDomains: Array<{ domain: string; clicks: number }>
  referrerSources: Array<{ source: string; clicks: number }>
  recentClicks: Array<{
    country: string
    browser: string
    device: string
    clickedAt: string
    isBot: boolean
  }>
}

/**
 * Get comprehensive analytics for all user URLs
 */
export async function getOverallAnalytics(userId: string): Promise<ClickAnalytics> {
  const supabase = await createServerClient()
  
  // Get user's URLs
  const { data: urls } = await supabase
    .from('urls')
    .select('id, short_code, original_url, title, clicks, is_active, created_at')
    .eq('user_id', userId)
  
  const typedUrls = urls as UrlRow[] | null
  
  if (!typedUrls || typedUrls.length === 0) {
    return {
      totalClicks: 0,
      totalUrls: 0,
      activeUrls: 0,
      todayClicks: 0,
      yesterdayClicks: 0,
      thisWeekClicks: 0,
      thisMonthClicks: 0,
      topCountries: [],
      topBrowsers: [],
      topDevices: [],
      topReferrers: [],
      topLanguages: [],
      referrerTypes: [],
      referrerDomains: [],
      referrerSources: [],
      recentClicks: [],
      clicksByDay: [],
      clicksByHour: [],
      trafficSources: [],
      botVsHuman: { human: 0, bot: 0 }
    }
  }
  
  const urlIds = typedUrls.map(url => url.id)
  
  // Date ranges
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000)
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const last30DaysStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  // Fetch all clicks for user's URLs
  const { data: clicks } = await supabase
    .from('clicks')
    .select(`
      id,
      url_id,
      short_code,
      country_name,
      browser_name,
      device_type,
      referer_type,
      referer_source,
      referer_domain,
      accept_language,
      clicked_at,
      is_bot,
      ip_address
    `)
    .in('url_id', urlIds)
    .order('clicked_at', { ascending: false })
    .limit(10000) // Reasonable limit
  
  const typedClicks = clicks as ClickRow[] | null
  
  if (!typedClicks) {
    return {
      totalClicks: 0,
      totalUrls: typedUrls.length,
      activeUrls: typedUrls.filter(url => url.is_active).length,
      todayClicks: 0,
      yesterdayClicks: 0,
      thisWeekClicks: 0,
      thisMonthClicks: 0,
      topCountries: [],
      topBrowsers: [],
      topDevices: [],
      topReferrers: [],
      topLanguages: [],
      referrerTypes: [],
      referrerDomains: [],
      referrerSources: [],
      recentClicks: [],
      clicksByDay: [],
      clicksByHour: [],
      trafficSources: [],
      botVsHuman: { human: 0, bot: 0 }
    }
  }
  
  // Filter clicks by time periods
  const todayClicks = typedClicks.filter(click => new Date(click.clicked_at) >= todayStart)
  const yesterdayClicks = typedClicks.filter(click => {
    const clickDate = new Date(click.clicked_at)
    return clickDate >= yesterdayStart && clickDate < todayStart
  })
  const thisWeekClicks = typedClicks.filter(click => new Date(click.clicked_at) >= weekStart)
  const thisMonthClicks = typedClicks.filter(click => new Date(click.clicked_at) >= monthStart)
  
  // Group clicks by country
  const countryStats = typedClicks.reduce((acc, click) => {
    const country = click.country_name || 'Unknown'
    acc[country] = (acc[country] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Group clicks by browser
  const browserStats = typedClicks.reduce((acc, click) => {
    const browser = click.browser_name || 'Unknown'
    acc[browser] = (acc[browser] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Group clicks by device
  const deviceStats = typedClicks.reduce((acc, click) => {
    const device = click.device_type || 'Unknown'
    acc[device] = (acc[device] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Group clicks by referrer
  const referrerStats = typedClicks.reduce((acc, click) => {
    const referrer = click.referer_source || click.referer_type || 'Direct'
    acc[referrer] = (acc[referrer] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Group clicks by language (parse accept_language header)
  const languageStats = typedClicks.reduce((acc, click) => {
    if (click.accept_language) {
      // Parse the first language from accept-language header
      // Format is usually like "en-US,en;q=0.9,es;q=0.8"
      const primaryLang = click.accept_language.split(',')[0].split('-')[0].toLowerCase()
      const languageNames: Record<string, string> = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'nl': 'Dutch',
        'sv': 'Swedish',
        'da': 'Danish',
        'no': 'Norwegian',
        'fi': 'Finnish',
        'pl': 'Polish',
        'tr': 'Turkish',
        'th': 'Thai'
      }
      const language = languageNames[primaryLang] || primaryLang.toUpperCase()
      acc[language] = (acc[language] || 0) + 1
    } else {
      acc['Unknown'] = (acc['Unknown'] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  // Group clicks by referrer type
  const referrerTypeStats = typedClicks.reduce((acc, click) => {
    const type = click.referer_type || 'direct'
    const typeNames: Record<string, string> = {
      'direct': 'Direct',
      'social': 'Social Media',
      'search': 'Search Engine',
      'website': 'Other Website',
      'email': 'Email',
      'ad': 'Advertisement'
    }
    const displayType = typeNames[type] || type.charAt(0).toUpperCase() + type.slice(1)
    acc[displayType] = (acc[displayType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Group clicks by referrer domain
  const referrerDomainStats = typedClicks.reduce((acc, click) => {
    const domain = click.referer_domain || 'Direct'
    acc[domain] = (acc[domain] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Group clicks by referrer source
  const referrerSourceStats = typedClicks.reduce((acc, click) => {
    const source = click.referer_source || 'Direct'
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Group clicks by traffic source type
  const trafficSourceStats = typedClicks.reduce((acc, click) => {
    const type = click.referer_type || 'direct'
    const source = click.referer_source || 'Direct'
    acc[source] = acc[source] || { type, clicks: 0 }
    acc[source].clicks += 1
    return acc
  }, {} as Record<string, { type: string; clicks: number }>)
  
  // Bot vs Human
  const botVsHuman = typedClicks.reduce((acc, click) => {
    if (click.is_bot) {
      acc.bot += 1
    } else {
      acc.human += 1
    }
    return acc
  }, { human: 0, bot: 0 })
  
  // Clicks by day (last 30 days) with device breakdown
  const clicksByDay: Record<string, Record<string, number>> = {}
  typedClicks.filter(click => new Date(click.clicked_at) >= last30DaysStart).forEach(click => {
    const date = new Date(click.clicked_at).toISOString().split('T')[0]
    const device = click.device_type || 'unknown'
    
    if (!clicksByDay[date]) {
      clicksByDay[date] = {}
    }
    clicksByDay[date][device] = (clicksByDay[date][device] || 0) + 1
  })
  
  // Clicks by hour (today)
  const clicksByHour = Array.from({ length: 24 }, (_, hour) => ({ hour, clicks: 0 }))
  todayClicks.forEach(click => {
    const hour = new Date(click.clicked_at).getHours()
    clicksByHour[hour].clicks += 1
  })
  
  // Recent clicks with URL info
  const recentClicks = typedClicks.slice(0, 10).map(click => {
    const url = typedUrls.find(u => u.id === click.url_id)
    return {
      id: click.id,
      shortCode: click.short_code,
      originalUrl: url?.original_url || '',
      country: click.country_name || 'Unknown',
      browser: click.browser_name || 'Unknown',
      device: click.device_type || 'Unknown',
      clickedAt: click.clicked_at,
      isBot: click.is_bot || false
    }
  })
  
  return {
    totalClicks: typedClicks.length,
    totalUrls: typedUrls.length,
    activeUrls: typedUrls.filter(url => url.is_active).length,
    todayClicks: todayClicks.length,
    yesterdayClicks: yesterdayClicks.length,
    thisWeekClicks: thisWeekClicks.length,
    thisMonthClicks: thisMonthClicks.length,
    topCountries: Object.entries(countryStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([country, clicks]) => ({ country, clicks })),
    topBrowsers: Object.entries(browserStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([browser, clicks]) => ({ browser, clicks })),
    topDevices: Object.entries(deviceStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([device, clicks]) => ({ device, clicks })),
    topReferrers: Object.entries(referrerStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([referrer, clicks]) => ({ referrer, clicks })),
    topLanguages: Object.entries(languageStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([language, clicks]) => ({ language, clicks })),
    referrerTypes: Object.entries(referrerTypeStats)
      .sort(([,a], [,b]) => b - a)
      .map(([type, clicks]) => ({ type, clicks })),
    referrerDomains: Object.entries(referrerDomainStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15)
      .map(([domain, clicks]) => ({ domain, clicks })),
    referrerSources: Object.entries(referrerSourceStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15)
      .map(([source, clicks]) => ({ source, clicks })),
    recentClicks,
    clicksByDay: Array.from({ length: 30 }, (_, i) => {
      const date = new Date(last30DaysStart.getTime() + i * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0]
      const dayData = clicksByDay[date] || {}
      const mobile = dayData.mobile || 0
      const desktop = dayData.desktop || 0  
      const tablet = dayData.tablet || 0
      const unknown = dayData.unknown || 0
      const total = mobile + desktop + tablet + unknown
      return { date, mobile, desktop, tablet, unknown, total }
    }),
    clicksByHour,
    trafficSources: Object.entries(trafficSourceStats)
      .sort(([,a], [,b]) => b.clicks - a.clicks)
      .slice(0, 10)
      .map(([source, data]) => ({ source, type: data.type, clicks: data.clicks })),
    botVsHuman
  }
}

/**
 * Get analytics for a specific URL
 */
export async function getUrlAnalytics(urlId: string, userId: string): Promise<UrlAnalytics | null> {
  const supabase = await createServerClient()
  
  // Get URL info
  const { data: url } = await supabase
    .from('urls')
    .select('id, short_code, original_url, title, clicks')
    .eq('id', urlId)
    .eq('user_id', userId)
    .single()
  
  const typedUrl = url as UrlRow | null
  
  if (!typedUrl) return null
  
  // Get clicks for this URL
  const { data: clicks } = await supabase
    .from('clicks')
    .select(`
      country_name,
      browser_name,
      device_type,
      referer_source,
      referer_type,
      referer_domain,
      accept_language,
      clicked_at,
      is_bot,
      ip_address
    `)
    .eq('url_id', urlId)
    .order('clicked_at', { ascending: false })
  
  const typedClicks = clicks as ClickRow[] | null
  
  if (!typedClicks) return null
  
  // Calculate unique clicks (by IP address)
  const uniqueIPs = new Set(typedClicks.map(click => click.ip_address).filter(Boolean))
  
  // Group data
  const countryStats = typedClicks.reduce((acc, click) => {
    const country = click.country_name || 'Unknown'
    acc[country] = (acc[country] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const browserStats = typedClicks.reduce((acc, click) => {
    const browser = click.browser_name || 'Unknown'
    acc[browser] = (acc[browser] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const referrerStats = typedClicks.reduce((acc, click) => {
    const referrer = click.referer_source || click.referer_type || 'Direct'
    acc[referrer] = (acc[referrer] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const referrerTypeStats = typedClicks.reduce((acc, click) => {
    const type = click.referer_type || 'direct'
    const typeNames: Record<string, string> = {
      'direct': 'Direct',
      'social': 'Social Media',
      'search': 'Search Engine',
      'website': 'Other Website',
      'email': 'Email',
      'ad': 'Advertisement'
    }
    const displayType = typeNames[type] || type.charAt(0).toUpperCase() + type.slice(1)
    acc[displayType] = (acc[displayType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const referrerDomainStats = typedClicks.reduce((acc, click) => {
    const domain = click.referer_domain || 'Direct'
    acc[domain] = (acc[domain] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const referrerSourceStats = typedClicks.reduce((acc, click) => {
    const source = click.referer_source || 'Direct'
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const languageStats = typedClicks.reduce((acc, click) => {
    if (click.accept_language) {
      // Parse the first language from accept-language header
      // Format is usually like "en-US,en;q=0.9,es;q=0.8"
      const primaryLang = click.accept_language.split(',')[0].split('-')[0].toLowerCase()
      const languageNames: Record<string, string> = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'nl': 'Dutch',
        'sv': 'Swedish',
        'da': 'Danish',
        'no': 'Norwegian',
        'fi': 'Finnish',
        'pl': 'Polish',
        'tr': 'Turkish',
        'th': 'Thai'
      }
      const language = languageNames[primaryLang] || primaryLang.toUpperCase()
      acc[language] = (acc[language] || 0) + 1
    } else {
      acc['Unknown'] = (acc['Unknown'] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)
  
  // Clicks by day (last 30 days) with device breakdown
  const last30DaysStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const clicksByDay: Record<string, Record<string, number>> = {}
  typedClicks.filter(click => new Date(click.clicked_at) >= last30DaysStart).forEach(click => {
    const date = new Date(click.clicked_at).toISOString().split('T')[0]
    const device = click.device_type || 'unknown'
    
    if (!clicksByDay[date]) {
      clicksByDay[date] = {}
    }
    clicksByDay[date][device] = (clicksByDay[date][device] || 0) + 1
  })
  
  return {
    urlId: typedUrl.id,
    shortCode: typedUrl.short_code,
    originalUrl: typedUrl.original_url,
    title: typedUrl.title,
    totalClicks: typedClicks.length,
    uniqueClicks: uniqueIPs.size,
    clicksByDay: Array.from({ length: 30 }, (_, i) => {
      const date = new Date(last30DaysStart.getTime() + i * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0]
      const dayData = clicksByDay[date] || {}
      const mobile = dayData.mobile || 0
      const desktop = dayData.desktop || 0  
      const tablet = dayData.tablet || 0
      const unknown = dayData.unknown || 0
      const total = mobile + desktop + tablet + unknown
      return { date, mobile, desktop, tablet, unknown, total }
    }),
    topCountries: Object.entries(countryStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([country, clicks]) => ({ country, clicks })),
    topBrowsers: Object.entries(browserStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([browser, clicks]) => ({ browser, clicks })),
    topLanguages: Object.entries(languageStats)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([language, clicks]) => ({ language, clicks: clicks as number })),
    topReferrers: Object.entries(referrerStats)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([referrer, clicks]) => ({ referrer, clicks: clicks as number })),
    referrerTypes: Object.entries(referrerTypeStats)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([type, clicks]) => ({ type, clicks: clicks as number })),
    referrerDomains: Object.entries(referrerDomainStats)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([domain, clicks]) => ({ domain, clicks: clicks as number })),
    referrerSources: Object.entries(referrerSourceStats)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([source, clicks]) => ({ source, clicks: clicks as number })),
    recentClicks: typedClicks.slice(0, 20).map(click => ({
      country: click.country_name || 'Unknown',
      browser: click.browser_name || 'Unknown',
      device: click.device_type || 'Unknown',
      clickedAt: click.clicked_at,
      isBot: click.is_bot || false
    }))
  }
}