import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, Star, Plus } from "lucide-react"
import Image from "next/image"

async function getRestaurant(id: string) {
  const { data: restaurant, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching restaurant:", error)
    return null
  }

  return restaurant
}

async function getMenuItems(restaurantId: string) {
  const { data: menuItems, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("is_available", true)
    .order("category")

  if (error) {
    console.error("Error fetching menu items:", error)
    return []
  }

  return menuItems
}

export default async function RestaurantPage({
  params,
}: {
  params: { id: string }
}) {
  const restaurant = await getRestaurant(params.id)
  const menuItems = await getMenuItems(params.id)

  if (!restaurant) {
    return <div>Restaurant not found</div>
  }

  const categories = Array.from(new Set(menuItems.map(item => item.category)))

  return (
    <div className="container py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-[2/1] rounded-lg overflow-hidden mb-6">
            <Image
              src={restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&h=500&fit=crop"}
              alt={restaurant.name}
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-primary" />
              <span className="font-semibold">{restaurant.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-5 w-5" />
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-5 w-5" />
              <span>30-45 mins</span>
            </div>
          </div>
          <p className="text-muted-foreground">{restaurant.description}</p>

          <Tabs defaultValue={categories[0]} className="mt-8">
            <TabsList>
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map(category => (
              <TabsContent key={category} value={category}>
                <div className="grid gap-4">
                  {menuItems
                    .filter(item => item.category === category)
                    .map(item => (
                      <Card key={item.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <p className="mt-2 font-semibold">${item.price.toFixed(2)}</p>
                          </div>
                          <Button size="icon" variant="secondary">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="lg:sticky lg:top-20 h-fit">
          <Card className="p-4">
            <h2 className="font-semibold mb-4">Your Order</h2>
            <div className="border-t pt-4">
              <p className="text-center text-muted-foreground">Your cart is empty</p>
              <Button className="w-full mt-4">Start Order</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}