import { UrlShortener } from '@/components/url-shortener'
import { ErrorHandler } from '@/components/error-handler'
import { Suspense } from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Suspense fallback={null}>
        <ErrorHandler />
      </Suspense>
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground sm:text-6xl mb-6">
            Shorten Your URLs
            <span className="text-primary block">Track Performance</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Create short, memorable links and get detailed analytics on how they perform. 
            Perfect for social media, marketing campaigns, and more.
          </p>
        </div>

        {/* URL Shortener Component */}
        <div className="max-w-4xl mx-auto">
          <UrlShortener />
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-card rounded-lg shadow-sm border border-border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Easy to Use</h3>
            <p className="text-muted-foreground">Simply paste your long URL and get a short link instantly. No registration required for basic usage.</p>
          </div>
          
          <div className="text-center p-6 bg-card rounded-lg shadow-sm border border-border">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Detailed Analytics</h3>
            <p className="text-muted-foreground">Track clicks, locations, devices, and more with comprehensive analytics for your shortened URLs.</p>
          </div>
          
          <div className="text-center p-6 bg-card rounded-lg shadow-sm border border-border">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Secure & Reliable</h3>
            <p className="text-muted-foreground">Your links are secure and reliable with 99.9% uptime. Manage and customize your links with ease.</p>
          </div>
        </div>
      </div>
    </div>
  )
}