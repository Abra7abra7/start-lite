"use server"

import { createClient } from '@/lib/supabase/server'
import { Hero } from '@/components/ui/animated-hero'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    return redirect('/login') // Redirect to login after sign out
  }

  return (
    <div className="flex flex-col min-h-screen">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-4xl flex justify-end items-center p-3 text-sm">
                {user ? (
                    <div className="flex items-center gap-4">
                        Hey, {user.email}!
                        <form action={signOut}>
                            <Button variant="outline">Logout</Button>
                        </form>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
        <main className="flex-1 flex flex-col items-center justify-center">
             {/* Original Hero component */}
            <Hero />
        </main>
    </div>
  )

}
