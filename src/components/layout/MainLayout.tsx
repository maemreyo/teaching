'use client'

import { useState, ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PanelLeft, PanelLeftClose } from 'lucide-react'

interface MainLayoutProps {
  children: ReactNode
  showSidebar?: boolean
  showFooter?: boolean
  className?: string
}

export function MainLayout({ 
  children, 
  showSidebar = true, 
  showFooter = true,
  className 
}: MainLayoutProps) {
  const { user } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarHidden, setSidebarHidden] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleSidebarVisibility = () => {
    setSidebarHidden(!sidebarHidden)
  }

  const shouldShowSidebar = showSidebar && user && !sidebarHidden

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        {shouldShowSidebar && (
          <div className={cn(
            "relative border-r bg-background transition-all duration-300",
            sidebarCollapsed ? "w-16" : "w-64"
          )}>
            <Sidebar collapsed={sidebarCollapsed} />
            
            {/* Sidebar Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background p-0 shadow-md hover:shadow-lg"
            >
              {sidebarCollapsed ? (
                <PanelLeft className="h-3 w-3" />
              ) : (
                <PanelLeftClose className="h-3 w-3" />
              )}
            </Button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col">
          {/* Mobile Sidebar Toggle */}
          {showSidebar && user && (
            <div className="md:hidden border-b p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebarVisibility}
                className="flex items-center gap-2"
              >
                <PanelLeft className="h-4 w-4" />
                {sidebarHidden ? 'Show Menu' : 'Hide Menu'}
              </Button>
            </div>
          )}

          {/* Page Content */}
          <main className={cn(
            "flex-1 overflow-auto",
            className
          )}>
            {children}
          </main>

          {/* Footer */}
          {showFooter && <Footer />}
        </div>
      </div>
    </div>
  )
}

// Convenience layout components for different page types

export function DashboardLayout({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <MainLayout showSidebar={true} showFooter={false} className={cn("p-6", className)}>
      {children}
    </MainLayout>
  )
}

export function AuthLayout({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <MainLayout showSidebar={false} showFooter={true} className={cn("flex items-center justify-center min-h-[calc(100vh-4rem)] p-4", className)}>
      {children}
    </MainLayout>
  )
}

export function GameLayout({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <MainLayout showSidebar={false} showFooter={false} className={cn("h-full", className)}>
      {children}
    </MainLayout>
  )
}

export function PublicLayout({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <MainLayout showSidebar={false} showFooter={true} className={className}>
      {children}
    </MainLayout>
  )
}