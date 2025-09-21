import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <ExternalLink className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Short Link Not Found</CardTitle>
          <CardDescription className="text-base">
            The shortened URL you&apos;re trying to access doesn&apos;t exist, has been deleted, or has been deactivated by its owner.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            This might happen if:
          </p>
          <ul className="text-sm text-gray-600 text-left space-y-1">
            <li>• The link was typed incorrectly</li>
            <li>• The link has expired or been deleted</li>
            <li>• The link has been deactivated by its owner</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                Create New Link
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}