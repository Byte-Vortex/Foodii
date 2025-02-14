"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoaderCircle, Trash } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/store/cart"; // Zustand store

export default function Cart() {
  const supabase = createClient();
  const { items, removeItem, clearCart, getTotal } = useCart();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
  
      const { data, error } = await supabase
        .from("cart")
        .select("id, quantity, unit_price, food!inner(name)")
        .eq("user_id", userData.user.id);
  
      if (error) throw error;
  
      console.log("Fetched data from Supabase:", data);
  
      // **Reset Zustand cart before adding new items**
      useCart.setState({ items: [] });
  
      // Convert fetched items into correct format
      const newItems = data.map((item) => ({
        id: item.id,
        name: item.food.name,
        price: item.unit_price,
        quantity: item.quantity,
        restaurantId: "some_restaurant_id",
        restaurantName: "Some Restaurant",
      }));
  
      // Add only fresh items to Zustand
      useCart.setState({ items: newItems });
  
      console.log("Updated Zustand cart:", useCart.getState().items);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  
  const handleRemove = async (id: string) => {
    try {
      await supabase.from("cart").delete().eq("id", id);
      removeItem(id); // Update Zustand store
      toast({ title: "Success", description: "Item removed from cart" });
      fetchCart();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading)
    return (
      <div className="h-[85vh] flex justify-center items-center">
        <LoaderCircle className="animate-spin h-10 w-10 text-primary" />
      </div>
    );

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

          {items.length === 0 ? (
            <p className="text-center">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <span>
                    {item.name} ({item.quantity}x) - ${item.price * item.quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleRemove(item.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 && (
            <div className="mt-6 text-right">
              <h2 className="text-lg font-semibold">Total: ${getTotal().toFixed(2)}</h2>
              <Button className="mt-4 w-full">Proceed to Checkout</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
