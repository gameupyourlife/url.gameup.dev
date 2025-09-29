'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CodeBlock } from './code-block'
import { Eye, Code, FileText } from 'lucide-react'

interface ResponseExample {
  status: number
  title: string
  description?: string
  data: object | string
  headers?: Record<string, string>
}

interface ResponsePreviewProps {
  responses: ResponseExample[]
  className?: string
}

export function ResponsePreview({ responses, className }: ResponsePreviewProps) {
  const [selectedResponse, setSelectedResponse] = useState(responses[0]?.status || 200)
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted')

  // const currentResponse = responses.find(r => r.status === selectedResponse) || responses[0]

  const formatJson = (data: object | string) => {
    if (typeof data === 'string') {
      try {
        return JSON.stringify(JSON.parse(data), null, 2)
      } catch {
        return data
      }
    }
    return JSON.stringify(data, null, 2)
  }

  const renderFormattedView = (data: object | string) => {
    if (typeof data === 'string') {
      return <div className="font-mono text-sm whitespace-pre-wrap">{data}</div>
    }

    const renderValue = (value: unknown, key?: string, depth = 0): React.ReactElement => {
      // const indent = '  '.repeat(depth)
      
      if (value === null) {
        return <span className="text-gray-500">null</span>
      }
      
      if (typeof value === 'boolean') {
        return <span className="text-blue-600">{value.toString()}</span>
      }
      
      if (typeof value === 'number') {
        return <span className="text-green-600">{value}</span>
      }
      
      if (typeof value === 'string') {
        return <span className="text-orange-600">&quot;{value}&quot;</span>
      }
      
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return <span className="text-gray-500">[]</span>
        }
        
        return (
          <div>
            <span className="text-gray-500">[</span>
            {value.map((item, index) => (
              <div key={index} className="ml-4">
                {renderValue(item, undefined, depth + 1)}
                {index < value.length - 1 && <span className="text-gray-500">,</span>}
              </div>
            ))}
            <span className="text-gray-500">]</span>
          </div>
        )
      }
      
      if (typeof value === 'object') {
        const entries = Object.entries(value)
        if (entries.length === 0) {
          return <span className="text-gray-500">{'{}'}</span>
        }
        
        return (
          <div>
            <span className="text-gray-500">{'{'}</span>
            {entries.map(([k, v], index) => (
              <div key={k} className="ml-4">
                <span className="text-purple-600">&quot;{k}&quot;</span>
                <span className="text-gray-500">: </span>
                {renderValue(v, k, depth + 1)}
                {index < entries.length - 1 && <span className="text-gray-500">,</span>}
              </div>
            ))}
            <span className="text-gray-500">{'}'}</span>
          </div>
        )
      }
      
      return <span>{String(value)}</span>
    }

    return (
      <div className="font-mono text-sm leading-relaxed">
        {renderValue(data)}
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Response Examples
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'formatted' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('formatted')}
            >
              <FileText className="h-4 w-4 mr-1" />
              Formatted
            </Button>
            <Button
              variant={viewMode === 'raw' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('raw')}
            >
              <Code className="h-4 w-4 mr-1" />
              Raw JSON
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedResponse.toString()} onValueChange={(value) => setSelectedResponse(parseInt(value))}>
          <TabsList className="grid w-full grid-cols-auto">
            {responses.map((response) => (
              <TabsTrigger key={response.status} value={response.status.toString()} className="flex items-center gap-2">
                <Badge
                  variant={response.status < 300 ? "default" : "destructive"}
                  className={response.status < 300 ? "bg-green-100 text-green-800" : ""}
                >
                  {response.status}
                </Badge>
                <span className="hidden sm:inline">{response.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {responses.map((response) => (
            <TabsContent key={response.status} value={response.status.toString()} className="mt-4">
              <div className="space-y-4">
                {response.description && (
                  <p className="text-sm text-muted-foreground">{response.description}</p>
                )}

                {response.headers && (
                  <div>
                    <h4 className="font-semibold mb-2">Response Headers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {Object.entries(response.headers).map(([key, value]) => (
                        <div key={key} className="flex justify-between p-2 bg-muted rounded">
                          <code className="font-mono">{key}:</code>
                          <code className="font-mono text-muted-foreground">{value}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Response Body</h4>
                  {viewMode === 'raw' ? (
                    <CodeBlock
                      code={formatJson(response.data)}
                      language="json"
                      title={`${response.status} ${response.title}`}
                    />
                  ) : (
                    <Card className="p-4 bg-muted/50">
                      {renderFormattedView(response.data)}
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Quick status badge component
interface StatusBadgeProps {
  status: number
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = (code: number) => {
    if (code < 300) return "bg-green-100 text-green-800 border-green-300"
    if (code < 400) return "bg-blue-100 text-blue-800 border-blue-300"  
    if (code < 500) return "bg-orange-100 text-orange-800 border-orange-300"
    return "bg-red-100 text-red-800 border-red-300"
  }

  const getStatusText = (code: number) => {
    const statusTexts: Record<number, string> = {
      200: "OK",
      201: "Created", 
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      422: "Unprocessable Entity",
      500: "Internal Server Error"
    }
    return statusTexts[code] || "Unknown"
  }

  return (
    <Badge variant="outline" className={`${getStatusColor(status)} ${className}`}>
      {status} {getStatusText(status)}
    </Badge>
  )
}