'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export default function Counter({ 
  end, 
  duration = 2, 
  suffix = '', 
  prefix = '',
  className = '' 
}: CounterProps) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { value: 0 }
      
      gsap.to(obj, {
        value: end,
        duration: duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: countRef.current,
          start: 'top 85%', // Mulai saat 85% dari viewport
          once: true,
        },
        onUpdate: () => {
          setCount(Math.floor(obj.value))
        }
      })
    })

    return () => ctx.revert()
  }, [end, duration])

  return (
    <span ref={countRef} className={className}>
      {prefix}{count.toLocaleString('id-ID')}{suffix}
    </span>
  )
}
