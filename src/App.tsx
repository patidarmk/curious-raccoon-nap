import * as React from 'react'
import { 
  createRouter, 
  RouterProvider, 
  createRootRoute, 
  createRoute as createTanStackRoute, 
  Outlet 
} from '@tanstack/react-router'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import SpaceInvaders from "./pages/SpaceInvaders";
import NotFound from "./pages/NotFound"; // Import NotFound page
import Layout from './components/Layout'; // Import the new Layout component

const queryClient = new QueryClient();

// Create root route
const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Layout> {/* Wrap the Outlet with the Layout component */}
          <Outlet />
        </Layout>
      </TooltipProvider>
    </QueryClientProvider>
  ),
  errorComponent: NotFound, // Add NotFound as the error component for the root route
})

// Create index route
const indexRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
})

// Create Space Invaders route
const spaceInvadersRoute = createTanStackRoute({
  getParentRoute: () => rootRoute,
  path: '/space-invaders',
  component: SpaceInvaders,
})

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  spaceInvadersRoute,
])

// Create router with proper TypeScript configuration
const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent' as const,
  defaultPreloadStaleTime: 0,
})

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App = () => <RouterProvider router={router} />

export default App;