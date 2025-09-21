import { ErrorHandler } from '@/components/error-handler'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Suspense fallback={null}>
        <ErrorHandler />
      </Suspense>
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now with advanced analytics
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Shorten URLs.
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Amplify Results.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            Transform long, complex URLs into short, shareable links. Get powerful analytics, 
            custom branding, and insights that drive your business forward.
          </p>
          
          {/* Hero CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
            <Link href="/auth/signup" className="inline-flex">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Start Shortening URLs
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link href="#features" className="inline-flex">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold transition-all duration-300">
                See How It Works
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-900">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-background flex items-center justify-center">
                <span className="text-sm font-bold text-white">J</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-background flex items-center justify-center">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-background flex items-center justify-center">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-background flex items-center justify-center">
                <span className="text-sm font-bold text-white">M</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Join <span className="font-semibold text-foreground">10,000+</span> users shortening links daily
            </p>
          </div>
        </div>

        {/* URL Shortener Component */}
        {/* <div className="max-w-4xl mx-auto mb-20">
          <UrlShortener />
        </div> */}

        {/* Social Proof - Statistics */}
        <div className="py-16 bg-card/30 rounded-3xl border border-border/50 backdrop-blur-sm mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Trusted by Thousands</h3>
            <p className="text-muted-foreground">Join the growing community of users who trust our platform</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">250K+</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wide">URLs Shortened</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">1.2M+</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wide">Clicks Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-2">10K+</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wide">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">99.9%</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wide">Uptime</div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">What Our Users Say</h3>
            <p className="text-muted-foreground">See how our URL shortener helps businesses grow</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-card-foreground mb-4">
                "This URL shortener has revolutionized our social media campaigns. The analytics are incredibly detailed and help us optimize our content strategy."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold text-white">SR</span>
                </div>
                <div>
                  <div className="font-semibold text-card-foreground">Sarah Rodriguez</div>
                  <div className="text-sm text-muted-foreground">Marketing Manager</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-card-foreground mb-4">
                "Perfect for our e-commerce business. We can track which products get the most attention and adjust our inventory accordingly. Game changer!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold text-white">MC</span>
                </div>
                <div>
                  <div className="font-semibold text-card-foreground">Mike Chen</div>
                  <div className="text-sm text-muted-foreground">E-commerce Owner</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-card-foreground mb-4">
                "As a content creator, I love how easy it is to create branded short links. The QR codes are a nice bonus for my offline marketing."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold text-white">AJ</span>
                </div>
                <div>
                  <div className="font-semibold text-card-foreground">Alex Johnson</div>
                  <div className="text-sm text-muted-foreground">Content Creator</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage, track, and optimize your shortened URLs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="group p-8 bg-card rounded-2xl shadow-sm border border-border hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-card-foreground mb-3 text-center">Lightning Fast</h4>
              <p className="text-muted-foreground text-center leading-relaxed">
                Generate short links instantly with our optimized infrastructure. No delays, no waiting - just fast, reliable URL shortening.
              </p>
              <div className="mt-4 text-center">
                <span className="inline-flex items-center text-sm text-primary font-medium">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  Instant generation
                </span>
              </div>
            </div>
            
            <div className="group p-8 bg-card rounded-2xl shadow-sm border border-border hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-card-foreground mb-3 text-center">Advanced Analytics</h4>
              <p className="text-muted-foreground text-center leading-relaxed">
                Get detailed insights on clicks, geographic data, devices, referrers, and more. Make data-driven decisions for your campaigns.
              </p>
              <div className="mt-4 text-center">
                <span className="inline-flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                  <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mr-2"></span>
                  Real-time tracking
                </span>
              </div>
            </div>
            
            <div className="group p-8 bg-card rounded-2xl shadow-sm border border-border hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-card-foreground mb-3 text-center">Enterprise Security</h4>
              <p className="text-muted-foreground text-center leading-relaxed">
                Bank-level security with SSL encryption, fraud protection, and 99.9% uptime guarantee. Your links are always safe and accessible.
              </p>
              <div className="mt-4 text-center">
                <span className="inline-flex items-center text-sm text-purple-600 dark:text-purple-400 font-medium">
                  <span className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mr-2"></span>
                  99.9% uptime
                </span>
              </div>
            </div>

            <div className="group p-8 bg-card rounded-2xl shadow-sm border border-border hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-card-foreground mb-3 text-center">Custom Branding</h4>
              <p className="text-muted-foreground text-center leading-relaxed">
                Create branded short links with custom domains and aliases. Build trust and recognition with every link you share.
              </p>
              <div className="mt-4 text-center">
                <span className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                  <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-2"></span>
                  Custom domains
                </span>
              </div>
            </div>

            <div className="group p-8 bg-card rounded-2xl shadow-sm border border-border hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-card-foreground mb-3 text-center">Team Collaboration</h4>
              <p className="text-muted-foreground text-center leading-relaxed">
                Share and manage links across your team. Role-based access, shared dashboards, and collaborative features included.
              </p>
              <div className="mt-4 text-center">
                <span className="inline-flex items-center text-sm text-orange-600 dark:text-orange-400 font-medium">
                  <span className="w-2 h-2 bg-orange-600 dark:bg-orange-400 rounded-full mr-2"></span>
                  Team workspaces
                </span>
              </div>
            </div>

            <div className="group p-8 bg-card rounded-2xl shadow-sm border border-border hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-pink-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-card-foreground mb-3 text-center">QR Code Generator</h4>
              <p className="text-muted-foreground text-center leading-relaxed">
                Generate QR codes for your short links automatically. Perfect for print materials, presentations, and offline marketing.
              </p>
              <div className="mt-4 text-center">
                <span className="inline-flex items-center text-sm text-pink-600 dark:text-pink-400 font-medium">
                  <span className="w-2 h-2 bg-pink-600 dark:bg-pink-400 rounded-full mr-2"></span>
                  Auto-generated QR
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-foreground mb-4">How It Works</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in seconds with our simple 3-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center group relative">
              {/* Step connector for desktop */}
              <div className="hidden md:block absolute top-10 left-full w-12 lg:w-16 h-0.5 bg-gradient-to-r from-primary to-pink-300 transform translate-x-4 lg:translate-x-8"></div>
              
              <div className="relative mx-auto mb-6 inline-block">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center border-2 border-background">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Paste Your URL</h4>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Simply paste your long URL into our shortener. Add a custom alias if you want a branded link, or let us generate one for you.
              </p>
            </div>

            <div className="text-center group relative">
              {/* Step connector for desktop */}
              <div className="hidden md:block absolute top-10 left-full w-12 lg:w-16 h-0.5 bg-gradient-to-r from-pink-300 to-rose-300 transform translate-x-4 lg:translate-x-8"></div>
              
              <div className="relative mx-auto mb-6 inline-block">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-background">
                  <span className="text-sm font-bold text-green-600">2</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Generate & Share</h4>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Get your shortened URL instantly with a QR code. Copy it to your clipboard and share it anywhere - social media, emails, or print.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mx-auto mb-6 inline-block">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center border-2 border-background">
                  <span className="text-sm font-bold text-purple-600">3</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">Track & Optimize</h4>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Monitor your link performance with detailed analytics. See clicks, locations, devices, and more to optimize your campaigns.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-16 bg-primary/5 rounded-3xl border border-border/50">
          <h3 className="text-4xl font-bold text-foreground mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses and creators who trust our platform to shorten, share, and track their links.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup" className="inline-flex">
              <Button size="lg" className="px-8 py-3 text-lg font-semibold">
                Start Free Trial
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link href="/auth/signin" className="inline-flex">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  )
}