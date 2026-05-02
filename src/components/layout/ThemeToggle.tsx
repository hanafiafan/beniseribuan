'use client'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-all duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-[18px] h-[18px] text-brand-400" />
      ) : (
        <Moon className="w-[18px] h-[18px] text-brand-700" />
      )}
    </button>
  )
}
