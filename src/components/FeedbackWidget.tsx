
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

interface FeedbackWidgetProps {
  apiKey?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  darkMode?: boolean;
  productName?: string;
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  apiKey = "demo-key",
  position = "bottom-right",
  darkMode = false,
  productName = "this product",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const positionClasses = {
    "bottom-right": "absolute bottom-4 right-4",
    "bottom-left": "absolute bottom-4 left-4",
    "top-right": "absolute top-4 right-4",
    "top-left": "absolute top-4 left-4",
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!firstName || !lastName || !email || !feedback || rating === null) {
      toast.error("Please fill in all required fields and provide a rating");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    
    // Feedback data object
    const feedbackData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      rating: rating,
      feedback: feedback,
      product_name: productName,
      url: window.location.href,
      user_agent: navigator.userAgent
    };
    
    try {
      // Submit to Supabase
      const { error } = await supabase
        .from('feedback')
        .insert(feedbackData);
        
      if (error) throw error;
      
      setLoading(false);
      setSubmitted(true);
      
      // Reset after delay
      setTimeout(() => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setFeedback("");
        setRating(null);
        setIsOpen(false);
        setTimeout(() => {
          setSubmitted(false);
        }, 300);
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
      setLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={cn(
              "transition-transform hover:scale-110 focus:outline-none",
              rating !== null && star <= rating
                ? "text-yellow-400"
                : "text-gray-300"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("z-50", positionClasses[position])}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2",
            darkMode
              ? "bg-gray-800 text-white focus:ring-gray-500"
              : "bg-primary text-white focus:ring-primary"
          )}
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
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
        </button>
      ) : (
        <div
          className={cn(
            "w-80 rounded-2xl p-4 shadow-xl transition-all ease-in-out duration-300 transform-gpu",
            darkMode ? "bg-gray-800 text-white" : "glass-panel",
            submitted
              ? "scale-95 opacity-0"
              : "scale-100 opacity-100 animate-fade-in"
          )}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">
              {submitted ? "Thank you!" : `How's ${productName}?`}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center py-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 text-green-500 mb-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-center">
                Your feedback has been submitted. We appreciate your input!
              </p>
            </div>
          ) : (
            <>
              {renderStars()}
              
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    First Name*
                  </label>
                  <Input
                    placeholder="Your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={cn(
                      "transition-all",
                      darkMode ? "bg-gray-700 border-gray-600" : ""
                    )}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Last Name*
                  </label>
                  <Input
                    placeholder="Your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={cn(
                      "transition-all",
                      darkMode ? "bg-gray-700 border-gray-600" : ""
                    )}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Email*
                  </label>
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      "transition-all",
                      darkMode ? "bg-gray-700 border-gray-600" : ""
                    )}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Feedback*
                  </label>
                  <Textarea
                    placeholder="Share your thoughts about our product..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className={cn(
                      "min-h-[100px] resize-none transition-all",
                      darkMode ? "bg-gray-700 border-gray-600" : ""
                    )}
                    required
                  />
                </div>
              </div>
              
              <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
              <div className="mt-3 text-xs text-center text-muted-foreground">
                Powered by FeedbackSaaS
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackWidget;
