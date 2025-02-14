import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight, UtensilsCrossed } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    name: "Fast Food",
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=500&h=300&fit=crop",
  },
  {
    name: "Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&h=300&fit=crop",
  },
  {
    name: "Sushi",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&h=300&fit=crop",
  },
  {
    name: "Desserts",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=500&h=300&fit=crop",
  },
]

const featuredRestaurants = [
  {
    name: "Burger Palace",
    image: "https://images.unsplash.com/photo-1606131731446-5568d87113aa?q=80&w=500&h=300&fit=crop",
    rating: 4.5,
    cuisine: "American",
    deliveryTime: "25-35",
  },
  {
    name: "Sushi Master",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&h=300&fit=crop",
    rating: 4.8,
    cuisine: "Japanese",
    deliveryTime: "35-45",
  },
  {
    name: "Pizza Express",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&h=300&fit=crop",
    rating: 4.3,
    cuisine: "Italian",
    deliveryTime: "30-40",
  },
]

export default function Home() {
  return (
    <div className="container flex flex-col mx-auto px-10 gap-10 pb-20">
      {/* Hero Section */}
      <section className="container flex flex-col lg:flex-row items-center gap-8 pt-8">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold lg:text-6xl">
            Delicious Food,
            <br />
            Delivered Fast
          </h1>
          <p className="text-xl text-muted-foreground">
            Order from your favorite restaurants and track your delivery in real-time
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/food">
                Order Now
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              View Menu
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&h=800&fit=crop"
            alt="Delicious Food"
            width={600}
            height={400}
            className="rounded-lg object-cover"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="container">
        <h2 className="text-3xl font-bold mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.name} className="group cursor-pointer overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="container">
        <h2 className="text-3xl font-bold mb-8">Featured Restaurants</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredRestaurants.map((restaurant) => (
            <Card key={restaurant.name} className="overflow-hidden">
              <div className="relative aspect-[3/2]">
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                <p className="text-muted-foreground">{restaurant.cuisine}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4" />
                    <span>{restaurant.rating} ★</span>
                  </div>
                  <span className="text-sm">{restaurant.deliveryTime} mins</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 bg-muted rounded-lg">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Fast Delivery</h3>
            <p className="text-muted-foreground">
              Get your food delivered within 30-45 minutes
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Live Tracking</h3>
            <p className="text-muted-foreground">
              Know where your order is at all times
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Easy Payment</h3>
            <p className="text-muted-foreground">
              Pay securely with multiple payment options
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}