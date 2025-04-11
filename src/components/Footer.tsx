
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
                S
              </div>
              <span className="font-semibold">ShipFast</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              The ultimate SaaS starter kit for busy founders.
            </p>
            <div className="flex space-x-4">
              {["Twitter", "GitHub", "LinkedIn"].map((social, i) => (
                <a key={i} href="#" className="text-muted-foreground hover:text-foreground">
                  {social}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {["Features", "Pricing", "Testimonials", "FAQ"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {["Documentation", "Blog", "Changelog", "Support"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {["About", "Contact", "Terms", "Privacy"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2023 ShipFast. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <div className="flex items-center text-sm text-primary">
              <span>Built by Ahmad in 3 days with</span>
              <Heart className="h-4 w-4 mx-1 fill-red-500 text-red-500" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
