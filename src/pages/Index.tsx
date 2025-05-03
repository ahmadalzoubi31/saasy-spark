
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import FeedbackWidget from "@/components/FeedbackWidget";
import { cn } from "@/lib/utils";

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

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

    return () => observer.disconnect();
  }, []);

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
    cta,
    popular = false,
    delay = 0,
  }: {
    name: string;
    price: string;
    description: string;
    features: string[];
    cta: string;
    popular?: boolean;
    delay?: number;
  }) => (
    <div
      className={cn(
        "animate-on-scroll opacity-0 flex flex-col p-6 rounded-xl border",
        popular
          ? "border-primary/50 shadow-lg shadow-primary/10"
          : "border-border"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {popular && (
        <div className="absolute top-0 right-0 translate-x-2 -translate-y-3">
          <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <div className="mb-5">
        <h3 className="text-lg font-medium">{name}</h3>
        <div className="mt-2 flex items-baseline text-3xl font-bold">
          {price}
          {price !== "Free" && <span className="text-base font-medium text-muted-foreground ml-1">/mo</span>}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      </div>
      <ul className="mb-6 flex-1 space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <div className="mr-2 h-5 w-5 shrink-0 text-primary">
              <Check className="h-5 w-5" />
            </div>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Link to="/auth?signup=true" className="mt-auto">
        <Button
          variant={popular ? "default" : "outline"}
          className={cn("w-full", popular && "btn-primary")}
        >
          {cta}
        </Button>
      </Link>
    </div>
  );

  return (
    <PageTransition>
      <div className="overflow-hidden pt-16">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative pt-20 pb-32 overflow-hidden"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          
          <div className="absolute top-1/3 -right-64 w-[600px] h-[600px] bg-primary/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10"></div>
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-block animate-fade-in">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-5">
                  Introducing Feedback SaaS
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-up">
                Collect and analyze feedback{" "}
                <span className="text-gradient">beautifully</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
                The most elegant way to collect, organize, and act on customer feedback. Elevate your product with insights that matter.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
                <Link to="/auth?signup=true">
                  <Button size="lg" className="h-12 px-8 btn-primary">
                    Get started for free
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-12 px-8"
                  onClick={() => {
                    const element = document.getElementById("pricing");
                    if (element) {
                      window.scrollTo({
                        top: element.offsetTop - 100,
                        behavior: 'smooth'
                      });
                    }
                  }}
                >
                  View pricing
                </Button>
              </div>
            </div>
            
            <div className="relative max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "300ms" }}>
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
        
        {/* Features Section */}
        <section
          ref={featuresRef}
          className="py-24 bg-secondary/50"
          id="features"
        >
          <div className="container">
            <div className="max-w-2xl mx-auto text-center mb-16 animate-on-scroll opacity-0">
              <h2 className="text-3xl font-bold mb-4">
                Everything you need for perfect feedback
              </h2>
              <p className="text-muted-foreground text-lg">
                All the tools to collect, analyze, and act on customer insights, 
                beautifully designed for a seamless experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Feature
                icon={
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
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                }
                title="Elegant Feedback Widget"
                description="A beautiful, customizable widget that seamlessly integrates with your product to collect feedback."
                delay={0}
              />
              
              <Feature
                icon={
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
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                    />
                  </svg>
                }
                title="Insightful Analytics"
                description="Transform feedback into actionable insights with our powerful analytics dashboard."
                delay={150}
              />
              
              <Feature
                icon={
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
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.379.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.379-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
                title="Customizable Integration"
                description="Tailor the widget to match your brand's identity with our flexible customization options."
                delay={300}
              />
              
              <Feature
                icon={
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
                      d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
                    />
                  </svg>
                }
                title="Team Collaboration"
                description="Work together to respond to feedback with our collaborative tools for teams of all sizes."
                delay={450}
              />
              
              <Feature
                icon={
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
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    />
                  </svg>
                }
                title="Automated Workflows"
                description="Set up triggers and actions based on feedback to automate your response processes."
                delay={600}
              />
              
              <Feature
                icon={
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
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                }
                title="Sentiment Analysis"
                description="Leverage AI to understand the sentiment behind your feedback and identify trends."
                delay={750}
              />
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section 
          ref={pricingRef}
          className="py-24 bg-background"
          id="pricing"
        >
          <div className="container">
            <div className="max-w-2xl mx-auto text-center mb-16 animate-on-scroll opacity-0">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-5">
                Simple Pricing
              </span>
              <h2 className="text-3xl font-bold mb-4">
                Choose the Perfect Plan for Your Needs
              </h2>
              <p className="text-muted-foreground text-lg">
                No hidden fees. No surprise costs. Start collecting valuable feedback today.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <PricingTier
                name="Starter"
                price="Free"
                description="Perfect for individuals and early-stage startups."
                features={[
                  "Up to 100 feedback responses",
                  "Basic analytics",
                  "Widget customization",
                  "Email support"
                ]}
                cta="Get Started Free"
                delay={0}
              />
              
              <PricingTier
                name="Professional"
                price="$49"
                description="Ideal for growing businesses and teams."
                features={[
                  "Unlimited feedback responses",
                  "Advanced analytics and reporting",
                  "Team collaboration tools",
                  "Multiple widgets",
                  "API access",
                  "Priority support"
                ]}
                cta="Start Free Trial"
                popular={true}
                delay={150}
              />
              
              <PricingTier
                name="Enterprise"
                price="$199"
                description="For large organizations with complex needs."
                features={[
                  "Everything in Professional",
                  "Custom integrations",
                  "White-label option",
                  "AI sentiment analysis",
                  "Dedicated account manager",
                  "SLA guarantees",
                  "24/7 phone support"
                ]}
                cta="Contact Sales"
                delay={300}
              />
            </div>
            
            <div className="mt-16 text-center animate-on-scroll opacity-0">
              <p className="text-muted-foreground">
                Need a custom plan? <Link to="/contact" className="text-primary font-medium">Contact us</Link> for tailored solutions.
              </p>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          <div className="absolute top-1/2 -left-64 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl -z-10"></div>
          
          <div className="container">
            <div className="glass-panel max-w-4xl mx-auto p-12 text-center animate-on-scroll opacity-0">
              <h2 className="text-3xl font-bold mb-4">
                Ready to elevate your customer feedback experience?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of companies using our platform to collect actionable 
                insights and build better products.
              </p>
              <Link to="/auth?signup=true">
                <Button size="lg" className="h-12 px-10 btn-primary">
                  Start your free trial
                </Button>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required. 14-day free trial.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="py-6 border-t border-border/50">
          <div className="container">
            <div className="flex justify-center items-center text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                Built by Ahmad in 3 days 
                <span className="inline-block animate-pulse">
                  ⚡
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;
