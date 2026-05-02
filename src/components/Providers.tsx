'use client'

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { useState, useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [themeEnabled, setThemeEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setThemeEnabled(data.theme_switcher_enabled === 'true')
      })
      .catch(() => setThemeEnabled(false))
  }, [])

  return (
    <SessionProvider>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="light" 
        forcedTheme={themeEnabled === false ? "light" : undefined}
        enableSystem={themeEnabled === true}
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
