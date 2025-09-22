import { createServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard-nav'
import { PlanProvider } from '@/lib/plan-context'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  return (
    <PlanProvider>
      <div className="min-h-screen bg-background">
        <DashboardNav user={user} />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </PlanProvider>
  )
}