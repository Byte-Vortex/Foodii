import './globals.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Auth from './login/page'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'FoodHub - Order Food Online',
  description: 'Order food online from your favorite restaurants',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
          <Header />
          <main className="min-h-screen w-full">{children}</main>
          <Toaster />
          <Footer />
          </AuthProvider>
          
        </ThemeProvider>
      </body>
    </html>
  )
}