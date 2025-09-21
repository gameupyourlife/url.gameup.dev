'use client';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
    Copy,
    ExternalLink,
    Edit,
    Trash2,
    BarChart3,
    Eye,
    EyeOff,
    MoreHorizontal
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { QRCodeGenerator } from '@/components/qr-code-generator';
import { updateUrlAction, deleteUrlAction, toggleUrlActiveAction } from '@/lib/actions';

type Url = {
  id: string
  original_url: string
  short_code: string
  title: string | null
  description: string | null
  clicks: number
  created_at: string
  updated_at: string
  is_active: boolean
}

interface UrlListProps {
  urls: Url[]
}

export function UrlList({ urls }: UrlListProps) {
  const [editingUrl, setEditingUrl] = useState<Url | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [isPending, startTransition] = useTransition()

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
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

  const handleEdit = (url: Url) => {
    setEditingUrl(url)
    setEditTitle(url.title || '')
    setEditDescription(url.description || '')
  }

  const handleSaveEdit = async () => {
    if (!editingUrl) return

    startTransition(async () => {
      try {
        const result = await updateUrlAction(editingUrl.id, {
          title: editTitle.trim() || undefined,
          description: editDescription.trim() || undefined,
        })

        if (result.success) {
          toast.success('URL updated successfully!')
          setEditingUrl(null)
        } else {
          toast.error(result.error || 'Failed to update URL')
        }
      } catch (error) {
        toast.error('Failed to update URL')
        console.error('Update error:', error)
      }
    })
  }

  const handleToggleActive = async (url: Url) => {
    startTransition(async () => {
      try {
        const result = await toggleUrlActiveAction(url.id)

        if (result.success) {
          toast.success(`URL ${url.is_active ? 'deactivated' : 'activated'} successfully!`)
        } else {
          toast.error(result.error || 'Failed to update URL status')
        }
      } catch (error) {
        toast.error('Failed to update URL status')
        console.error('Toggle active error:', error)
      }
    })
  }

  const handleDelete = async (url: Url) => {
    if (!confirm('Are you sure you want to delete this URL? This action cannot be undone.')) {
      return
    }

    startTransition(async () => {
      try {
        const result = await deleteUrlAction(url.id)

        if (result.success) {
          toast.success('URL deleted successfully!')
        } else {
          toast.error(result.error || 'Failed to delete URL')
        }
      } catch (error) {
        toast.error('Failed to delete URL')
        console.error('Delete error:', error)
      }
    })
  }

  if (urls.length === 0) {
    return (
      <div className="text-center py-12">
        <ExternalLink className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No URLs</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating your first shortened URL.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URL</TableHead>
              <TableHead></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {urls.map((url) => (
              <TableRow key={url.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {getBaseUrl()}/{url.short_code}
                      </code>
                      
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-[300px]">
                      {url.original_url}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center space-x-2">
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`${getBaseUrl()}/${url.short_code}`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openUrl(`${getBaseUrl()}/${url.short_code}`)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <QRCodeGenerator 
                        shortCode={url.short_code} 
                      />
                    </div>
                </TableCell>
                <TableCell>
                  <div>
                    {url.title && (
                      <div className="font-medium">{url.title}</div>
                    )}
                    {url.description && (
                      <div className="text-sm text-gray-500">{url.description}</div>
                    )}
                    {!url.title && !url.description && (
                      <span className="text-gray-400">No title</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="h-4 w-4 text-gray-400" />
                    <span>{url.clicks}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {url.is_active ? (
                      <>
                        <Eye className="h-4 w-4 text-green-500" />
                        <span className="text-green-700">Active</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">Inactive</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(url.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(url)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleActive(url)}>
                        {url.is_active ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(url)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingUrl} onOpenChange={() => setEditingUrl(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit URL</DialogTitle>
            <DialogDescription>
              Update the title and description for your shortened URL.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editTitle">Title</Label>
              <Input
                id="editTitle"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter a title for this URL"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Input
                id="editDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Enter a description for this URL"
                maxLength={200}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUrl(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}