'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Copy, ExternalLink } from 'lucide-react'
import Link from 'next/link'

type ShortenedUrl = {
  id: string
  original_url: string
  short_code: string
  short_url: string
  clicks: number
  created_at: string
}

export function UrlShortener() {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null)

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      toast.error('Please enter a URL')
      return
    }

    if (!isValidUrl(url)) {
      toast.error('Please enter a valid URL')
      return
    }

    setIsLoading(true)

    try {
      const shortCode = customCode.trim() || generateShortCode()
      
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl: url,
          customCode: shortCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL')
      }

      setShortenedUrl(data)
      toast.success('URL shortened successfully!')
      setUrl('')
      setCustomCode('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to shorten URL')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (_error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shorten Your URL</CardTitle>
          <CardDescription>
            Enter a long URL to get a shortened version. Optionally, you can customize the short code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL to shorten *</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/very/long/url/that/needs/shortening"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customCode">Custom short code (optional)</Label>
              <Input
                id="customCode"
                type="text"
                placeholder="my-custom-code"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                maxLength={20}
              />
              <p className="text-sm text-gray-500">
                Only letters, numbers, hyphens, and underscores allowed. Leave empty for auto-generated code.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {shortenedUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Your shortened URL is ready!</CardTitle>
            <CardDescription>
              Share this link anywhere. It will redirect to your original URL.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
              <div className="flex-1 font-mono text-sm break-all">
                {shortenedUrl.short_url}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(shortenedUrl.short_url)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openUrl(shortenedUrl.short_url)}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Original URL:</strong> {shortenedUrl.original_url}</p>
              <p><strong>Short Code:</strong> {shortenedUrl.short_code}</p>
              <p><strong>Created:</strong> {new Date(shortenedUrl.created_at).toLocaleString()}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Want to track clicks and manage your URLs? 
                <Link href="/auth" className="text-blue-600 hover:underline ml-1">
                  Sign up for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}