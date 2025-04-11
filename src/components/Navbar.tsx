
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Zap } from "lucide-react";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/?section=" + sectionId);
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
                F
              </div>
              <span className="font-semibold">Feedback</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              Home
            </Link>
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              Pricing
            </button>
            <Link
              to="/dashboard"
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              Dashboard
            </Link>
          </nav>
          
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="default" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {location.pathname === "/" && (
        <footer className="bg-background/80 backdrop-blur-xl border-t py-6">
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
      )}
    </>
  );
};

export default Navbar;
