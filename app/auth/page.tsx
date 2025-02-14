"use client"

import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"

export default function AuthPage() {
  return (
    <div className="container max-w-lg py-12">
      <Card className="p-8">
        <h1 className="text-2xl font-bold mb-8 text-center">Welcome to FoodHub</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          redirectTo={`${window.location.origin}/auth/callback`}
          theme="default"
        />
      </Card>
    </div>
  )
}