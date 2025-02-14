import { supabase } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

async function getRestaurants() {
  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("is_active", true)
    .order("rating", { ascending: false })

  if (error) {
    console.error("Error fetching restaurants:", error)
    return []
  }

  return restaurants
}

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants()

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search restaurants..."
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Cuisine</Button>
          <Button variant="outline">Rating</Button>
          <Button variant="outline">Distance</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <Link key={restaurant.id} href={`/restaurants/${restaurant.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video">
                <Image
                  src={restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500&h=300&fit=crop"}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
                <p className="text-muted-foreground text-sm mb-2">{restaurant.cuisine_type}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary" />
                    <span>{restaurant.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">2.4 km</span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}