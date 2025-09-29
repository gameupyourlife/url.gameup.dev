'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  filename?: string
  showLineNumbers?: boolean
  className?: string
  highlightLines?: number[]
}

export function CodeBlock({
  code,
  language = 'javascript',
  title,
  filename,
  showLineNumbers = false,
  className,
  highlightLines = []
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const lines = code.split('\n')

  const getLanguageColor = (lang: string) => {
    const colors = {
      javascript: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      typescript: 'bg-blue-100 text-blue-800 border-blue-300',
      json: 'bg-green-100 text-green-800 border-green-300',
      bash: 'bg-gray-100 text-gray-800 border-gray-300',
      curl: 'bg-purple-100 text-purple-800 border-purple-300',
      http: 'bg-orange-100 text-orange-800 border-orange-300'
    }
    return colors[lang as keyof typeof colors] || 'bg-rose-100 text-rose-800 border-rose-300'
  }

  return (
    <Card className={cn("relative overflow-hidden pt-0", className)}>
      {/* Header */}
      {(title || filename || language) && (
        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
          <div className="flex items-center gap-3">
            {filename && (
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <code className="text-sm font-mono">{filename}</code>
              </div>
            )}
            {title && !filename && (
              <h4 className="text-sm font-semibold">{title}</h4>
            )}
            {language && (
              <Badge variant="outline" className={getLanguageColor(language)}>
                {language.toUpperCase()}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 w-8 p-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {/* Code Content */}
      <div className="relative">
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          <code className="font-mono">
            {showLineNumbers ? (
              lines.map((line, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex",
                    highlightLines.includes(index + 1) && "bg-rose-50 dark:bg-rose-900/20 -mx-4 px-4"
                  )}
                >
                  <span className="text-muted-foreground select-none w-8 text-right mr-4 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))
            ) : (
              code
            )}
          </code>
        </pre>

        {/* Copy button for blocks without header */}
        {!title && !filename && !language && (
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </Card>
  )
}

// Quick copy component for inline code
interface InlineCodeProps {
  children: string
  copyable?: boolean
}

export function InlineCode({ children, copyable = false }: InlineCodeProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!copyable) {
    return (
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
        {children}
      </code>
    )
  }

  return (
    <code
      className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm cursor-pointer hover:bg-muted/80 transition-colors inline-flex items-center gap-1"
      onClick={copyToClipboard}
      title="Click to copy"
    >
      {children}
      {copied ? (
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3 opacity-50" />
      )}
    </code>
  )
}