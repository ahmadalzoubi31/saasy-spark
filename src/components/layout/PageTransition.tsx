
import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const pageElement = pageRef.current;
    if (pageElement) {
      pageElement.style.opacity = "0";
      pageElement.style.transform = "translateY(15px)";
      
      // Trigger animation after a tiny delay to ensure the styles are applied
      setTimeout(() => {
        pageElement.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        pageElement.style.opacity = "1";
        pageElement.style.transform = "translateY(0)";
      }, 50);
    }
    
    return () => {
      if (pageElement) {
        pageElement.style.opacity = "0";
        pageElement.style.transform = "translateY(15px)";
      }
    };
  }, [location.pathname]);
  
  return (
    <div ref={pageRef} className="min-h-[calc(100vh-5rem)]">
      {children}
    </div>
  );
};

export default PageTransition;
