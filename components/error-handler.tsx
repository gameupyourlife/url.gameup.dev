'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export function ErrorHandler() {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const error = searchParams.get('error')
    
    if (error === 'not-found') {
      toast.error('The shortened URL you\'re looking for doesn\'t exist or has been deactivated.')
    } else if (error === 'server-error') {
      toast.error('Something went wrong. Please try again later.')
    }
  }, [searchParams])
  
  return null
}