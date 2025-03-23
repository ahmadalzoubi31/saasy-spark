
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/layout/PageTransition";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="glass-panel px-8 py-12 text-center max-w-md mx-auto">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-xl mb-6">Page not found</p>
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button className="btn-primary">Return to Home</Button>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
