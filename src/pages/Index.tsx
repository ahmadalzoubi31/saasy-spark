import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/layout/PageTransition";
import FeedbackWidget from "@/components/FeedbackWidget";
import { cn } from "@/lib/utils";
import { Check, Star, Rocket, Package, Zap, FileCode, Clock, ShieldCheck } from "lucide-react";
import Footer from "@/components/Footer";

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
            entry.target.classList.remove("opacity-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    const urlParams = new URLSearchParams(location.search);
    const section = urlParams.get("section");
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }

    return () => observer.disconnect();
  }, [location]);

  const Feature = ({
    icon,
    title,
    description,
    delay = 0,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay?: number;
  }) => (
    <div
      className="animate-on-scroll opacity-0 flex flex-col items-center text-center p-6 glass-panel-sm"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mb-4 p-3 rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );

  const PricingTier = ({ 
    name, 
    price, 
    description, 
    features, 
    highlighted = false,
    delay = 0 
  }: { 
    name: string; 
    price: string; 
    description: string; 
    features: string[];
    highlighted?: boolean;
    delay?: number;
  }) => (
    <div 
      className={cn(
        "animate-on-scroll opacity-0 flex flex-col p-6 rounded-2xl shadow-lg h-full",
        highlighted 
          ? "border-2 border-primary bg-primary/5 relative" 
          : "glass-panel-sm"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
          Most Popular
        </div>
      )}
      <div className="mb-5">
        <h3 className="text-xl font-bold">{name}</h3>
        <div className="mt-2 mb-1 flex items-baseline">
          <span className="text-3xl font-extrabold">{price}</span>
          {price !== "Free" && <span className="ml-1 text-muted-foreground">/month</span>}
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="flex-grow">
        <ul className="space-y-3 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 mr-2 text-primary">
                <Check size={20} strokeWidth={3} className="mt-0.5" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <Link to="/auth?signup=true" className="mt-auto">
        <Button 
          className={highlighted ? "w-full btn-primary" : "w-full"} 
          variant={highlighted ? "default" : "outline"}
        >
          Get started
        </Button>
      </Link>
    </div>
  );

  const Testimonial = ({ 
    quote, 
    author, 
    role,
    avatar,
    delay = 0 
  }: { 
    quote: string; 
    author: string; 
    role: string;
    avatar?: string;
    delay?: number;
  }) => (
    <div 
      className="animate-on-scroll opacity-0 flex flex-col p-6 glass-panel-sm"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center mb-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star key={star} size={16} className="text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="my-4 text-lg">{quote}</p>
      <div className="flex items-center mt-auto">
        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
          {avatar ? (
            <img src={avatar} alt={author} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-medium">
              {author.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );

  return (
    <PageTransition>
      <div className="overflow-hidden">
        <section
          ref={heroRef}
          className="relative py-20 md:py-32 overflow-hidden"
          id="hero"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          
          <div className="absolute top-1/3 -right-64 w-[600px] h-[600px] bg-primary/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10"></div>
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-block animate-fade-in">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-5">
                  Ship Your SaaS Fast
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-up">
                Launch your SaaS in{" "}
                <span className="text-gradient">hours, not months</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
                The ultimate React SaaS boilerplate to help founders focus on their product and launch faster.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
                <Link to="/auth?signup=true">
                  <Button size="lg" className="h-12 px-8 btn-primary">
                    Get started for free
                  </Button>
                </Link>
                <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    View pricing
                  </Button>
                </button>
              </div>
              
              <div className="mt-8 flex items-center justify-center text-sm text-muted-foreground">
                <Check className="mr-2 h-4 w-4" /> No credit card required
                <span className="mx-3">•</span>
                <Check className="mr-2 h-4 w-4" /> 14-day free trial
                <span className="mx-3">•</span>
                <Check className="mr-2 h-4 w-4" /> Cancel anytime
              </div>
            </div>
            
            <div className="relative max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: "300ms" }}>
              <div className="glass-panel p-4 md:p-6 shadow-2xl">
                <div className="aspect-[16/9] overflow-hidden rounded-lg border border-border/40 bg-white">
                  <div className="flex h-10 items-center border-b bg-muted/50 px-4">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <div className="ml-4 flex h-6 w-72 items-center rounded-md bg-muted px-2 text-xs text-muted-foreground">
                      https://yourdomain.com
                    </div>
                  </div>
                  <div className="relative p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-4">
                        <div className="h-8 w-48 rounded-md bg-muted/60"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-full rounded-md bg-muted/60"></div>
                          <div className="h-4 w-5/6 rounded-md bg-muted/60"></div>
                          <div className="h-4 w-4/6 rounded-md bg-muted/60"></div>
                        </div>
                        <div className="h-10 w-32 rounded-md bg-primary"></div>
                      </div>
                      <div className="flex items-center justify-center">
                        <FeedbackWidget position="bottom-right" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 -z-10 h-96 w-96 rounded-full bg-primary/30 blur-3xl"></div>
            </div>
          </div>
        </section>
        
        <section
          className="py-20 md:py-28"
        >
          <div className="container">
            <div className="text-center mb-10">
              <p className="text-sm font-medium text-primary mb-1">TRUSTED BY HUNDREDS OF STARTUPS</p>
              <h2 className="text-3xl font-bold">Built for serious founders</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-10">
              {["Company 1", "Company 2", "Company 3", "Company 4", "Company 5", "Company 6"].map((company, i) => (
                <div key={i} className="flex items-center justify-center h-12">
                  <div className="text-xl font-semibold text-muted-foreground">{company}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section
          ref={featuresRef}
          className="py-24 bg-secondary/50"
          id="features"
        >
          <div className="container">
            <div className="max-w-2xl mx-auto text-center mb-16 animate-on-scroll opacity-0">
              <h2 className="text-3xl font-bold mb-4">
                Everything you need to ship faster
              </h2>
              <p className="text-muted-foreground text-lg">
                Stop wasting time reinventing the wheel. ShipFast comes packed with all the features 
                you need to focus on what really matters.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Feature
                icon={<Rocket className="h-6 w-6" />}
                title="Launch Faster"
                description="Go from idea to production in hours, not months. All the boilerplate is taken care of."
                delay={0}
              />
              
              <Feature
                icon={<Package className="h-6 w-6" />}
                title="Authentication Ready"
                description="Complete authentication system with email/password, magic links, and social logins."
                delay={150}
              />
              
              <Feature
                icon={<Zap className="h-6 w-6" />}
                title="Payments Included"
                description="Stripe subscription payments ready to go, including checkout and customer portal."
                delay={300}
              />
              
              <Feature
                icon={<FileCode className="h-6 w-6" />}
                title="Modern Tech Stack"
                description="Built with React, TypeScript, Tailwind CSS, and other modern tools developers love."
                delay={450}
              />
              
              <Feature
                icon={<Zap className="h-6 w-6" />}
                title="SEO Optimized"
                description="SEO best practices built in, so your product ranks well on search engines."
                delay={600}
              />
              
              <Feature
                icon={<Clock className="h-6 w-6" />}
                title="Regular Updates"
                description="Actively maintained and updated with new features and security patches."
                delay={750}
              />
            </div>
          </div>
        </section>
        
        <section className="py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll opacity-0">
              <h2 className="text-3xl font-bold mb-4">How it works</h2>
              <p className="text-muted-foreground text-lg">
                Launch your SaaS business in three simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
              {[
                {
                  number: "01",
                  title: "Clone the repo",
                  description: "Get started with a single command. Clone the repo and you're halfway there."
                },
                {
                  number: "02",
                  title: "Customize it",
                  description: "Add your brand colors, logo, and content. The codebase is clean and easy to customize."
                },
                {
                  number: "03",
                  title: "Launch it",
                  description: "Deploy with a single click to Vercel or your preferred hosting provider."
                }
              ].map((step, i) => (
                <div key={i} className="animate-on-scroll opacity-0 flex flex-col items-center text-center" style={{ transitionDelay: `${i * 150}ms` }}>
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-24 bg-secondary/30">
          <div className="container">
            <div className="max-w-3xl mx-auto mb-16 animate-on-scroll opacity-0">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">What founders say</h2>
                <p className="text-muted-foreground text-lg">
                  Don't just take our word for it
                </p>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    question: "Is this a one-time payment?",
                    answer: "Yes, all our packages are one-time payments. You get access to the complete source code and specified period of updates."
                  },
                  {
                    question: "What tech stack is used?",
                    answer: "ShipFast is built with React, TypeScript, Tailwind CSS, and Supabase for backend functionalities."
                  },
                  {
                    question: "Do I need to know how to code?",
                    answer: "Basic knowledge of React and JavaScript will help you customize the codebase to your needs. But we provide documentation to help you get started."
                  },
                  {
                    question: "Can I use this for client projects?",
                    answer: "Absolutely! The Starter and Pro licenses allow you to use ShipFast for a single end product. For multiple client projects, check out our Enterprise license."
                  },
                  {
                    question: "Do you offer refunds?",
                    answer: "Due to the digital nature of the product, we do not offer refunds. But we do offer a free demo so you can try before you buy."
                  }
                ].map((faq, i) => (
                  <div key={i} className="border-b border-border pb-6">
                    <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          <div className="absolute top-1/2 -left-64 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl -z-10"></div>
          
          <div className="container">
            <div className="glass-panel max-w-4xl mx-auto p-12 text-center animate-on-scroll opacity-0">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                <Rocket className="h-8 w-8" />
              </div>
              
              <h2 className="text-3xl font-bold mb-4">
                Ready to ship your SaaS faster?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Join hundreds of founders who have accelerated their journey from idea to paying customers using ShipFast.
              </p>
              <Link to="/auth?signup=true">
                <Button size="lg" className="h-12 px-10 btn-primary">
                  Start your 14-day free trial
                </Button>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required. Cancel anytime.
              </p>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
