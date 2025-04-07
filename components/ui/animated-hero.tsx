'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MoveRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0)
  const titles = useMemo(() => ['Poctivé', 'Lokálne', 'Kvalitné', 'Naše'], [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0)
      } else {
        setTitleNumber(titleNumber + 1)
      }
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [titleNumber, titles])

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40">
          {/* Updated Víno Pútec Logo URL and added drop shadow for visibility */}
          <Image 
            src="https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/logo/logoputec-removebg-preview.png" 
            alt="Víno Pútec Logo"
            width={84} 
            height={84}
            priority 
            className="[filter:drop-shadow(0_1px_3px_rgba(255,255,255,0.6))]" 
          />
          <div className="flex flex-col gap-4">
            {/* Update animated text color to putec-primary */}
            <h1 className="font-regular max-w-2xl text-center text-5xl tracking-tighter text-white md:text-7xl">
              <span className="relative flex w-full justify-center overflow-hidden text-center md:mb-1">
                &nbsp; 
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-putec-primary"
                    initial={{ opacity: 0, y: '-100' }}
                    transition={{ type: 'spring', stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
              <span className="font-semibold">Víno Pútec</span> 
            </h1>

            {/* Updated paragraph text color for visibility */}
            <p className="max-w-2xl text-center text-lg leading-relaxed tracking-tight text-gray-200 md:mt-8 md:text-xl">
              Objavte chuť Malých Karpát v každej fľaši. Kvalitné vína s tradíciou a láskou.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Link href="/produkty"> 
              <Button size="lg" className="gap-4">
                Objavte Naše Vína <MoveRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Hero }
