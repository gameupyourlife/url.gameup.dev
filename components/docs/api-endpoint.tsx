'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button' // Removed unused import
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { ChevronDown, ChevronRight, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { CodeBlock } from './code-block'
import { cn } from '@/lib/utils'

interface Parameter {
  name: string
  type: string
  required?: boolean
  description: string
  example?: string
  enum?: string[]
  default?: string
}

interface Response {
  status: number
  description: string
  example: string
  schema?: string
}

interface ApiEndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  endpoint: string
  title: string
  description: string
  parameters?: Parameter[]
  requestBody?: {
    description: string
    example: string
    schema?: string
  }
  responses: Response[]
  examples?: {
    title: string
    request?: string
    response: string
    language?: string
  }[]
  notes?: {
    type: 'info' | 'warning' | 'success'
    content: string
  }[]
  authRequired?: boolean
  rateLimit?: string
}

export function ApiEndpoint({
  method,
  endpoint,
  title,
  description,
  parameters = [],
  requestBody,
  responses,
  examples = [],
  notes = [],
  authRequired = true,
  rateLimit
}: ApiEndpointProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    parameters: parameters.length > 0,
    requestBody: !!requestBody,
    responses: false,
    examples: false
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'bg-blue-100 text-blue-800 border-blue-300',
      POST: 'bg-green-100 text-green-800 border-green-300',
      PUT: 'bg-orange-100 text-orange-800 border-orange-300',
      DELETE: 'bg-red-100 text-red-800 border-red-300',
      PATCH: 'bg-purple-100 text-purple-800 border-purple-300'
    }
    return colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const getNoteIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />
      case 'success':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getNoteColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/10'
      case 'warning':
        return 'border-amber-200 bg-amber-50 dark:bg-amber-900/10'
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/10'
      default:
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/10'
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={getMethodColor(method)}>
                {method}
              </Badge>
              <code className="text-lg font-mono px-3 py-1 bg-muted rounded">{endpoint}</code>
            </div>
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription className="mt-2">{description}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-right">
            {authRequired && (
              <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-300">
                Auth Required
              </Badge>
            )}
            {rateLimit && (
              <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300">
                {rateLimit}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Notes */}
        {notes.length > 0 && (
          <div className="space-y-3">
            {notes.map((note, index) => (
              <Card key={index} className={cn("p-4", getNoteColor(note.type))}>
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "mt-0.5",
                    note.type === 'info' && "text-blue-600",
                    note.type === 'warning' && "text-amber-600",
                    note.type === 'success' && "text-green-600"
                  )}>
                    {getNoteIcon(note.type)}
                  </div>
                  <div className="text-sm">{note.content}</div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Parameters */}
        {parameters.length > 0 && (
          <Collapsible
            open={expandedSections.parameters}
            onOpenChange={() => toggleSection('parameters')}
          >
            <CollapsibleTrigger className="w-full justify-between p-0 h-auto bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 border-none">
              <h3 className="text-lg font-semibold">Parameters</h3>
              {expandedSections.parameters ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="space-y-3">
                {parameters.map((param, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-sm">{param.name}</code>
                        {param.required && (
                          <Badge variant="destructive" className="h-5 text-xs">Required</Badge>
                        )}
                        <Badge variant="outline" className="h-5 text-xs">{param.type}</Badge>
                      </div>
                      {param.default && (
                        <Badge variant="secondary" className="h-5 text-xs">
                          Default: {param.default}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{param.description}</p>
                    {param.example && (
                      <div className="text-xs">
                        <strong>Example:</strong> <code className="bg-muted px-1 rounded">{param.example}</code>
                      </div>
                    )}
                    {param.enum && (
                      <div className="text-xs mt-2">
                        <strong>Allowed values:</strong>{' '}
                        {param.enum.map((value, i) => (
                          <code key={i} className="bg-muted px-1 rounded mr-1">{value}</code>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Request Body */}
        {requestBody && (
          <Collapsible
            open={expandedSections.requestBody}
            onOpenChange={() => toggleSection('requestBody')}
          >
            <CollapsibleTrigger className="w-full justify-between p-0 h-auto bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 border-none">
              <h3 className="text-lg font-semibold">Request Body</h3>
              {expandedSections.requestBody ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">{requestBody.description}</p>
              <CodeBlock
                code={requestBody.example}
                language="json"
                title="Request Body Example"
              />
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Responses */}
        <Collapsible
          open={expandedSections.responses}
          onOpenChange={() => toggleSection('responses')}
        >
          <CollapsibleTrigger className="w-full justify-between p-0 h-auto bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 border-none">
            <h3 className="text-lg font-semibold">Responses</h3>
            {expandedSections.responses ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            {responses.map((response, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Badge
                    variant={response.status < 300 ? "default" : "destructive"}
                    className={response.status < 300 ? "bg-green-100 text-green-800" : ""}
                  >
                    {response.status}
                  </Badge>
                  <span className="text-sm font-medium">{response.description}</span>
                </div>
                <CodeBlock
                  code={response.example}
                  language="json"
                  title={`${response.status} Response`}
                />
              </Card>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Examples */}
        {examples.length > 0 && (
          <Collapsible
            open={expandedSections.examples}
            onOpenChange={() => toggleSection('examples')}
          >
            <CollapsibleTrigger className="w-full justify-between p-0 h-auto bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 border-none">
              <h3 className="text-lg font-semibold">Examples</h3>
              {expandedSections.examples ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 mt-4">
              {examples.map((example, index) => (
                <div key={index} className="space-y-4">
                  <h4 className="font-semibold">{example.title}</h4>
                  {example.request && (
                    <CodeBlock
                      code={example.request}
                      language={example.language || 'curl'}
                      title="Request"
                    />
                  )}
                  <CodeBlock
                    code={example.response}
                    language="json"
                    title="Response"
                  />
                  {index < examples.length - 1 && <Separator />}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  )
}