"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button className="transition-transform duration-300" variant="none" size="icon" onClick={toggleTheme}>
      <SunIcon className={`h-[1.2rem] w-[1.2rem] transition-all ${isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
      <MoonIcon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
    </Button>
  )
}