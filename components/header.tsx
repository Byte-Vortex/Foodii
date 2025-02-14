"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, UtensilsCrossed, LogOutIcon } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/hooks/useAuth"
import { CartButton } from "./cart-button"

export function Header() {
  const pathname = usePathname()
  const { user ,signOut} = useAuth()
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex justify-between items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
          <UtensilsCrossed className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Foodii</span>
          </Link>
          
        </div>
        <nav className="hidden md:flex gap-6">
            <Link 
              href="/food"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/food" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Food Items
            </Link>
            <Link 
              href="/offers"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/offers" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Offers
            </Link>
            <Link 
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/about" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              About
            </Link>
          </nav>
        <div className="flex items-center gap-4">
          {!user && (<div className="flex gap-4">
            <Link href="/login">
              <Button >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline">
                Sign Up
              </Button>
            </Link>
          </div>)}
          {user ? <>
          <Link href="/cart">
          <CartButton></CartButton>
          </Link>
          <Link href="/profile">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          
          </Link>
          <Button size="icon" variant="ghost"  onClick={signOut}><LogOutIcon className="text-foreground"></LogOutIcon></Button></> : 
            <Link href="/login"></Link>}
          
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}