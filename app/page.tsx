"use server"

import { Hero } from '@/components/ui/animated-hero'

export default async function Home() {
  const heroImageUrl = "https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/hero%20(2).webp";

  return (
    // Outer container for background image and overlay
    <div 
      className="relative flex min-h-screen flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${heroImageUrl}')` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Hero content needs to be above the overlay */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
          <Hero />
      </div>
    </div>
  )
}
