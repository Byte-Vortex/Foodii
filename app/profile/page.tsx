"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createClient } from '@/utils/supabase/client';
import { LoaderCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function Profile() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data || "");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address, // Update address
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({ title: "Success", description: "Profile updated successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!profile)
    return (
      <div className="h-[85vh] flex justify-center items-center">
        <LoaderCircle className="animate-spin h-10 w-10 text-primary" />
      </div>
    );

  return (
    <div className="h-[90vh] py-20">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
          <form onSubmit={handleUpdate} className="space-y-6" noValidate>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Full Name</Label>
              <Input
                type="text"
                value={profile.full_name || ""}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</Label>
              <Input
                type="tel"
                value={profile.phone || ""}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Address</Label>
              <Input
                type="text"
                value={profile.address || ""}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading && (
                <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Update Profile
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
