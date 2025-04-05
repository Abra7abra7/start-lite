import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PrihlaseniePage({ searchParams }: { searchParams: { message: string } }) {
  const signIn = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Redirect back to the Slovak login path
      return redirect('/prihlasenie?message=Nepodarilo sa prihlásiť používateľa')
    }

    // Redirect to homepage after successful login
    return redirect('/')
  }

  const signUp = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // emailRedirectTo: `${origin}/auth/callback`, // Optional: For email confirmation
      },
    })

    if (error) {
      console.error('Sign up error:', error)
      // Redirect back to the Slovak login path
      return redirect('/prihlasenie?message=Nepodarilo sa zaregistrovať používateľa')
    }

    // Redirect back to login with a success message
    return redirect('/prihlasenie?message=Registrácia úspešná! Prosím, prihláste sa.')

  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto">
      <Link
        href="/"
        className="absolute left-8 top-24 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg> Späť
      </Link>

      <form className="flex-1 flex flex-col w-full justify-center gap-4 text-foreground">
        <h1 className="text-2xl font-bold mb-4">Prihlásenie / Registrácia</h1>
        <Label className="text-md" htmlFor="email">
          Email
        </Label>
        <Input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="vas@email.sk"
          required
        />
        <Label className="text-md" htmlFor="password">
          Heslo
        </Label>
        <Input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <Button formAction={signIn} variant="default" className="px-4 py-2 mb-2">
          Prihlásiť sa
        </Button>
        <Button formAction={signUp} variant="outline" className="border border-foreground/20 px-4 py-2">
          Zaregistrovať sa
        </Button>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
