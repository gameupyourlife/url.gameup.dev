'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  Shield,
  Activity,
  AlertTriangle,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from './ui/checkbox';

interface ApiKey {
  id: string
  user_id: string
  name: string
  key_prefix: string
  scopes: string[]
  created_at: string
  last_used_at: string | null
  expires_at: string | null
  is_active: boolean
  updated_at: string
}

interface ApiKeyStats {
  totalKeys: number
  activeKeys: number
  totalRequests: number
  requestsToday: number
  requestsThisMonth: number
}

export function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [stats, setStats] = useState<ApiKeyStats>({
    totalKeys: 0,
    activeKeys: 0,
    totalRequests: 0,
    requestsToday: 0,
    requestsThisMonth: 0
  })
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showKeyValue, setShowKeyValue] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false)
  const [newKeyToken, setNewKeyToken] = useState<string>('')

  // Create API Key Form State
  const [newKey, setNewKey] = useState({
    name: '',
    scopes: ['read'],
    expiresAt: ''
  })

  useEffect(() => {
    loadApiKeys()
  }, [])

  useEffect(() => {
    if (!loading) {
      loadStats()
    }
  }, [apiKeys, loading]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadApiKeys = async () => {
    try {
      const response = await fetch('/api/api-keys', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to load API keys')
      }

      const result = await response.json()
      setApiKeys(result.data || [])
    } catch (error) {
      console.error('Failed to load API keys:', error)
      toast.error('Failed to load API keys')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // Calculate stats from loaded API keys
      const totalKeys = apiKeys.length
      const activeKeys = apiKeys.filter(key => key.is_active && !isExpired(key.expires_at || undefined)).length

      // TODO: Implement usage tracking in backend to get real request counts
      setStats({
        totalKeys,
        activeKeys,
        totalRequests: 0,
        requestsToday: 0,
        requestsThisMonth: 0
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const createApiKey = async () => {
    try {
      if (!newKey.name.trim()) {
        toast.error('Please enter a key name')
        return
      }

      const payload = {
        name: newKey.name,
        scopes: newKey.scopes,
        expires_at: newKey.expiresAt || null
      }

      const response = await fetch('/api/api-keys', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create API key')
      }

      const result = await response.json()
      const createdKey = result.data

      // Store the full token temporarily for display
      setNewKeyToken(createdKey.token)

      // Reload the API keys to get the updated list
      await loadApiKeys()

      setNewKey({ name: '', scopes: ['read'], expiresAt: '' })
      setShowCreateDialog(false)
      setShowNewKeyDialog(true) // Show the new key token

      toast.success('API key created successfully')
    } catch (error) {
      console.error('Failed to create API key:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create API key')
    }
  }

  const deleteApiKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/api-keys/${keyId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete API key')
      }

      // Reload the API keys to get the updated list
      await loadApiKeys()

      toast.success('API key deleted successfully')
    } catch (error) {
      console.error('Failed to delete API key:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete API key')
    }
  }

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(keyId)
      setTimeout(() => setCopiedKey(null), 2000)
      toast.success('API key copied to clipboard')
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy to clipboard')
    }
  }

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeyValue(showKeyValue === keyId ? null : keyId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isExpired = (expiresAt?: string) => {
    return expiresAt && new Date(expiresAt) < new Date()
  }

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case 'read': return 'default'
      case 'write': return 'secondary'
      case 'admin': return 'destructive'
      default: return 'outline'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">API Keys</h3>
          <p className="text-sm text-muted-foreground">
            Manage your API keys and access tokens for programmatic access
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key for accessing your account programmatically.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="keyName">Key Name *</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Production API, Mobile App"
                  value={newKey.name}
                  onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Scopes</Label>
                <div className="flex flex-wrap gap-2">
                  {['read', 'write', 'admin'].map(scope => (
                    <label key={scope} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={newKey.scopes.includes(scope)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewKey({ ...newKey, scopes: [...newKey.scopes, scope] })
                          } else {
                            setNewKey({ ...newKey, scopes: newKey.scopes.filter(s => s !== scope) })
                          }
                        }}
                      />
                      <span className="text-sm capitalize">{scope}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={newKey.expiresAt}
                  onChange={(e) => setNewKey({ ...newKey, expiresAt: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createApiKey} disabled={!newKey.name.trim()}>
                Create Key
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Key Display Dialog */}
        <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Save Your API Key
              </DialogTitle>
              <DialogDescription>
                This is the only time you&apos;ll see the full API key. Copy it now and store it securely.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Your New API Key</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-muted p-2 rounded font-mono break-all">
                    {newKeyToken}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(newKeyToken, 'new-key')}
                  >
                    {copiedKey === 'new-key' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>Important:</strong> Store this key securely. You won&apos;t be able to see it again.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
              <Input
                id="expiresAt"
                type="date"
                value={newKey.expiresAt}
                onChange={(e) => setNewKey({ ...newKey, expiresAt: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createApiKey} disabled={!newKey.name.trim()}>
                Create Key
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Key Display Dialog */}
        <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Save Your API Key
              </DialogTitle>
              <DialogDescription>
                This is the only time you&apos;ll see the full API key. Copy it now and store it securely.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Your New API Key</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-muted p-2 rounded font-mono break-all">
                    {newKeyToken}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(newKeyToken, 'new-key')}
                  >
                    {copiedKey === 'new-key' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>Important:</strong> Store this key securely. You won&apos;t be able to see it again.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  setShowNewKeyDialog(false)
                  setNewKeyToken('')
                }}
              >
                I&apos;ve Saved It
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalKeys}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeKeys} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeKeys}</div>
            <p className="text-xs text-muted-foreground">
              Currently enabled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.requestsThisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.requestsToday} today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Manage and monitor your API keys. Keep your keys secure and rotate them regularly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No API Keys</h3>
              <p className="text-muted-foreground mb-4">
                Create your first API key to start using the API programmatically.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Scopes</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => {
                  const expired = isExpired(apiKey.expires_at || undefined)

                  return (
                    <TableRow key={apiKey.id}>
                      <TableCell className="font-medium">
                        {apiKey.name}
                        {expired && (
                          <Badge variant="destructive" className="ml-2">
                            Expired
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {showKeyValue === apiKey.id
                              ? apiKey.key_prefix + '*********************'
                              : apiKey.key_prefix + '***'
                            }
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {showKeyValue === apiKey.id ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key_prefix, apiKey.id)}
                            title="Copy key prefix"
                          >
                            {copiedKey === apiKey.id ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {apiKey.scopes.map(scope => (
                            <Badge key={scope} variant={getScopeColor(scope)}>
                              {scope}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">
                            Usage tracking coming soon
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {apiKey.last_used_at ? formatDate(apiKey.last_used_at) : 'Never'}
                      </TableCell>

                      <TableCell>
                        <Badge variant={apiKey.is_active && !expired ? 'default' : 'secondary'}>
                          {apiKey.is_active && !expired ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteApiKey(apiKey.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Usage Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Security Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Keep your API keys secure and never share them publicly</p>
            <p>• Rotate your keys regularly for better security</p>
            <p>• Use the minimum required scopes for each key</p>
            <p>• Set usage limits to prevent unexpected charges</p>
            <p>• Monitor key usage and deactivate unused keys</p>
          </div>
        </CardContent>
      </Card>
    </div >
  )
}