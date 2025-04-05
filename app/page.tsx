"use server"

import { Hero } from '@/components/ui/animated-hero'

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
        <Hero />
    </div>
  )
}
