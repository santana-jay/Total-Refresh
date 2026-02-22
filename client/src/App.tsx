// =============================================================================
// APP ROOT (client/src/App.tsx)
// =============================================================================
// This is the top-level React component that renders the entire application.
// It sets up:
//   - React Query (for server-state caching and data fetching)
//   - Tooltip provider (for hover tooltips throughout the UI)
//   - Toast notifications (success/error popups)
//   - The router (maps URL paths to page components)
// =============================================================================

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Book from "@/pages/book";
import Services from "@/pages/services";
import Contact from "@/pages/contact";
import About from "@/pages/about";
import Admin from "@/pages/admin";
import ComingSoon from "@/pages/coming-soon";

// Router — maps each URL path to its page component, wrapped in the shared Layout
function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/book" component={Book} />
        <Route path="/services" component={Services} />
        <Route path="/contact" component={Contact} />
        <Route path="/about" component={About} />
        <Route path="/coming-soon" component={ComingSoon} />
        <Route path="/superadminmothafucka" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

// App — wraps everything in global providers
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
