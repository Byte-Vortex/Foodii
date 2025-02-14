"use client";

import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

interface AddToCartButtonProps {
  item: {
    id: string;
    name: string;
    price: number;
  };
  restaurantId: string;
  restaurantName: string;
}

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const supabase = createClient();
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();
  const [added, setAdded] = useState(false);



  async function handleAddToCart() {
    if (added) return;
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
  
      const { data, error } = await supabase.from("cart").insert({
        user_id: userData.user.id,
        unit_price: item.price,
        quantity: 1,
        food_id: item.id, // Ensure this matches your schema
      });
  
      if (error) throw error;
  
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
      });
  
      toast({
        title: "Item added to cart",
        description: `${item.name} has been added to your cart`,
      });
      setTimeout(() => setAdded(false), 3000); // Reset after 3 seconds
    } catch (error: any) {
      console.error("Error adding to cart:", error.message);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }
  

  return (
    <Button variant="secondary" className="flex gap-3" onClick={handleAddToCart}>
      <Plus className="h-4 w-4" /> Cart
    </Button>
  );
}
