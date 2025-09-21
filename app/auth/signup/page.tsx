'use client';;
import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const supabase = createBrowserClient()

    const ensureProfileExists = async (user: User) => {
        try {
            // First, check if profile exists using the current session
            const { data: existingProfile, error: fetchError } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .single()

            if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error('Error checking for existing profile:', fetchError)
            }

            if (!existingProfile) {
                // Profile doesn't exist, try to create it
                // Since we might not have proper session yet, make a request to an API endpoint
                try {
                    const response = await fetch('/api/create-profile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: user.id,
                            email: user.email,
                            fullName: fullName.trim() || null
                        }),
                    })

                    if (response.ok) {
                        console.log('Profile created successfully via API')
                    } else {
                        console.error('Failed to create profile via API')
                    }
                } catch (apiError) {
                    console.error('API request failed:', apiError)
                }
            }
        } catch (error) {
            console.error('Error in ensureProfileExists:', error)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true)
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`
                }
            })

            if (error) {
                toast.error(error.message)
            }
        } catch (_error) {
            toast.error('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (!email.trim()) {
            toast.error('Email is required')
            setIsLoading(false)
            return
        }

        if (!password.trim()) {
            toast.error('Password is required')
            setIsLoading(false)
            return
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long')
            setIsLoading(false)
            return
        }

        if (!fullName.trim()) {
            toast.error('Full name is required')
            setIsLoading(false)
            return
        }

        try {
            console.log('Attempting sign up with:', { email, fullName })

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            })

            console.log('Sign up response:', { data, error })

            if (error) {
                console.error('Sign up error:', error)

                // Check if it's a database error related to profile creation
                if (error.message.includes('Database error saving new user')) {
                    toast.error('There was an issue setting up your profile. Please contact support or try again later.')

                    // Optionally try to create profile manually (if you want to implement this)
                    // await createProfileManually(data.user)
                } else {
                    toast.error(`Sign up failed: ${error.message}`)
                }
            } else {
                console.log('Sign up successful:', data)

                if (data.user && !data.user.email_confirmed_at) {
                    toast.success('Account created successfully! Please check your email to verify your account.')
                } else {
                    toast.success('Account created successfully!')
                    await ensureProfileExists(data.user!)
                    window.location.href = '/dashboard'
                }
            }
        } catch (_error) {
            toast.error('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center px-4 py-8 min-h-screen">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold text-foreground">Create Account</CardTitle>
                    <CardDescription className="text-base">
                        Join us today! Create your account to start shortening URLs.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSignUp} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password (min. 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>
                        <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full h-11 relative font-medium"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                    >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                    </Button>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link href="/auth/signin" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}