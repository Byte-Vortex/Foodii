"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/store/cart"

export function CartButton() {
  const items = useCart((state) => state.items)
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Button variant="ghost" size="icon" className="relative">
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Button>
  )
}