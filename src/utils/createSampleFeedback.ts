
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const createSampleFeedback = async () => {
  try {
    const sampleFeedback = {
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      rating: 4,
      feedback: "This is a sample feedback entry to test the dashboard functionality."
    };
    
    console.log("Creating sample feedback:", sampleFeedback);
    
    const { data, error } = await supabase
      .from('feedback')
      .insert(sampleFeedback)
      .select();
      
    if (error) {
      console.error("Error creating sample feedback:", error);
      toast.error(`Failed to create sample feedback: ${error.message}`);
      return null;
    }
    
    console.log("Sample feedback created successfully:", data);
    toast.success("Sample feedback created successfully");
    return data[0];
  } catch (error) {
    console.error("Unexpected error creating sample feedback:", error);
    toast.error("An unexpected error occurred");
    return null;
  }
};
