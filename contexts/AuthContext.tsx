'use client';

import { createContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {isLoading ? <Preloader /> : children}
    </AuthContext.Provider>
  );
}

// Simple Preloader Component
function Preloader() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Loader2 className='h-10 w-10 text-primary animate-spin'></Loader2>
    </div>
  );
}
