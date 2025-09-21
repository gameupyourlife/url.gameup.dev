'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createUrlSchema, type CreateUrlInput, formatValidationErrors, isReservedPath } from '@/lib/validation'
import { createUrlAction } from '@/lib/actions'

export function CreateUrlForm() {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  const validateInput = (input: CreateUrlInput) => {
    try {
      createUrlSchema.parse(input)
      setErrors({})
      return true
    } catch (error: any) {
      const validationErrors = formatValidationErrors(error)
      setErrors(validationErrors)
      
      // Show the first error in a toast
      const firstError = Object.values(validationErrors)[0]
      if (firstError) {
        toast.error(firstError)
      }
      
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const inputData: CreateUrlInput = {
      original_url: url.trim(),
      short_code: customCode.trim() || undefined,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
    }

    // Validate the input
    if (!validateInput(inputData)) {
      return
    }

    startTransition(async () => {
      try {
        const result = await createUrlAction(inputData)

        if (result.success) {
          toast.success('URL shortened successfully!')
          // Clear the form
          setUrl('')
          setCustomCode('')
          setTitle('')
          setDescription('')
          setErrors({})
        } else {
          if (result.errors) {
            setErrors(result.errors)
          }
          toast.error(result.error || 'Failed to shorten URL')
        }
      } catch (error: any) {
        toast.error('An unexpected error occurred')
        console.error('Form submission error:', error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="url">URL to shorten *</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/very/long/url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              // Clear errors when user starts typing
              if (errors.original_url) {
                setErrors(prev => ({ ...prev, original_url: '' }))
              }
            }}
            required
            className={errors.original_url ? 'border-red-500' : ''}
          />
          {errors.original_url && (
            <p className="text-sm text-red-600">{errors.original_url}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="customCode">Custom short code (optional)</Label>
          <Input
            id="customCode"
            type="text"
            placeholder="my-custom-code"
            value={customCode}
            onChange={(e) => {
              const value = e.target.value.replace(/[^a-zA-Z0-9-_]/g, '')
              setCustomCode(value)
              
              // Clear errors when user starts typing
              if (errors.short_code) {
                setErrors(prev => ({ ...prev, short_code: '' }))
              }
              
              // Show real-time validation for reserved paths
              if (value && isReservedPath(value)) {
                setErrors(prev => ({ 
                  ...prev, 
                  short_code: `"${value}" is a reserved path and cannot be used` 
                }))
              }
            }}
            maxLength={20}
            className={errors.short_code ? 'border-red-500' : ''}
          />
          {errors.short_code && (
            <p className="text-sm text-red-600">{errors.short_code}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title (optional)</Label>
          <Input
            id="title"
            type="text"
            placeholder="My Important Link"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (errors.title) {
                setErrors(prev => ({ ...prev, title: '' }))
              }
            }}
            maxLength={100}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            type="text"
            placeholder="Brief description of the link"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              if (errors.description) {
                setErrors(prev => ({ ...prev, description: '' }))
              }
            }}
            maxLength={200}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Short URL'}
      </Button>
    </form>
  );
}