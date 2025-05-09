
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const NavItem = ({ to, label, isSection = false }: { to: string; label: string; isSection?: boolean }) => {
    const isActive = !isSection && location.pathname === to;
    
    return (
      <Link
        to={to}
        className={cn(
          "text-sm font-medium transition-colors px-4 py-2 rounded-lg",
          isActive
            ? "text-primary"
            : "text-foreground/80 hover:text-foreground hover:bg-secondary/50"
        )}
        onClick={(e) => {
          if (isSection) {
            e.preventDefault();
            const element = document.getElementById(to.substring(1));
            if (element) {
              window.scrollTo({
                top: element.offsetTop - 100,
                behavior: 'smooth'
              });
            }
          }
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex h-16 items-center transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl backdrop-saturate-150 shadow-sm border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link
          to="/"
          className="text-lg font-semibold flex items-center gap-2 text-foreground"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
            F
          </div>
          <span>Feedback</span>
        </Link>
        
        <nav className="hidden md:flex space-x-1 items-center">
          <NavItem to="/" label="Home" />
          <NavItem to="#features" label="Features" isSection={true} />
          <NavItem to="#pricing" label="Pricing" isSection={true} />
          {session ? (
            <NavItem to="/dashboard" label="Dashboard" />
          ) : null}
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          {!session ? (
            <>
              <Link to="/auth">
                <Button variant="ghost" className="font-medium">
                  Log in
                </Button>
              </Link>
              <Link to="/auth?signup=true">
                <Button className="font-medium btn-primary">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/dashboard">
              <Button className="font-medium btn-primary">
                Dashboard
              </Button>
            </Link>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                menuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              }
            />
          </svg>
        </button>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm p-4 md:hidden animate-fade-in">
          <nav className="flex flex-col space-y-3">
            <NavItem to="/" label="Home" />
            <NavItem to="#features" label="Features" isSection={true} />
            <NavItem to="#pricing" label="Pricing" isSection={true} />
            {session ? (
              <NavItem to="/dashboard" label="Dashboard" />
            ) : null}
            <div className="flex flex-col gap-2 pt-3 border-t border-border/30">
              {!session ? (
                <>
                  <Link to="/auth" className="w-full">
                    <Button variant="outline" className="w-full font-medium">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/auth?signup=true" className="w-full">
                    <Button className="w-full font-medium">
                      Get Started
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="w-full">
                  <Button className="w-full font-medium">
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
