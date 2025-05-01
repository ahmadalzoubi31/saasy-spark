
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import { Zap } from "lucide-react";

const queryClient = new QueryClient();

// Footer component
const Footer = () => {
  const location = useLocation();
  
  // Only show footer on home page
  if (location.pathname !== "/") return null;
  
  return (
    <footer className="bg-background/80 backdrop-blur-xl border-t py-6 mt-auto">
      <div className="container flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-2 group">
          <span className="text-sm text-muted-foreground">Built by Ahmad in</span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold group-hover:text-primary transition-colors">3 days</span>
            <Zap size={16} className="text-yellow-500 group-hover:animate-pulse" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          © {new Date().getFullYear()} Feedback SaaS. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

// App wrapper with layout
const AppWrapper = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppWrapper />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
