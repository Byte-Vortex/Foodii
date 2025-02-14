"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
  image_url?: string;
}

const categories = ["All", "Pizza", "Burger", "Salad", "Pasta", "Dessert", "Drink"];

export default function FoodPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 20]);
  const [maxPrice, setMaxPrice] = useState(20);

  useEffect(() => {
    async function fetchFoods() {
      const { data, error } = await supabase.from("food").select("*").eq("is_available", true);

      if (error) {
        console.error("Error fetching foods:", error.message);
      }

      if (data) {
        setFoods(data);
        setFilteredFoods(data);
        const prices = data.map((food) => food.price);
        setMaxPrice(Math.max(...prices, 20)); // Ensure a default range
        setPriceRange([0, Math.max(...prices, 20)]);
      }
    }

    fetchFoods();
  }, []);

  useEffect(() => {
    let filtered = foods;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((food) => food.category === selectedCategory);
    }

    // Apply price range filter
    filtered = filtered.filter((food) => food.price >= priceRange[0] && food.price <= priceRange[1]);

    setFilteredFoods(filtered);
  }, [searchQuery, selectedCategory, priceRange, foods]);

  return (
    <div className="container h-screen py-8 mx-auto px-10">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search foods..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-4">Price Range</h3>
                <Slider
                  min={0}
                  max={maxPrice}
                  step={1}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFoods.map((food) => (
          <Card key={food.id} className="overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={
                  food.image_url ||
                  `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&h=300&fit=crop`
                }
                alt={food.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{food.name}</h3>
                  <p className="text-sm text-muted-foreground">{food.description}</p>
                </div>
                <AddToCartButton
                  item={food}
                  restaurantId="default"
                  restaurantName="FoodHub"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">${food.price.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">{food.category}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredFoods.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No foods found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
