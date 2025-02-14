'use client';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label'
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  name: z.string().min(6),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function Register() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleRegister = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email:values.email,
        password:values.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: authData.user.email,    // Required field
              full_name: values.name,
            },
          ])
          .select(); // Optional: to verify insertion
      
        if (profileError) {
          console.error('Insert Error:', profileError.message);
          throw profileError;
        }
      }      


      toast({
        title: 'Success',
        description: `Account created for ${values.name}`,
      });

      router.push('/');
      }
     catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[90vh] bg-gradient-to-b from-primary/20 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-gray-600">Join HealthHub today</p>
        </div>
        <div className='grid gap-3'>

        <form onSubmit={form.handleSubmit(handleRegister)} noValidate>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Diggle"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={loading}
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="johndiggle@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={loading}
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder={`* * * * * * * * * * * * *`}
              disabled={loading}
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={`* * * * * * * * * * * * *`}
              disabled={loading}
              {...form.register('confirmPassword')}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button disabled={loading}>
            {loading && (
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            Sign Up
          </Button>
        </div>
        </div>
      </form>

      <div className="relative ">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or
          </span>
        </div>
      </div>
      <Link
        href="/login"
        
      >
        <Button variant="outline" className='w-full text-foreground/70'
      disabled={loading}>
        Sign In with existing account
      </Button>
        
      </Link>
      </div>
      </Card>
    </div>
  );
}