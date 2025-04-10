
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FeedbackStatus } from "@/types/feedback";

export const updateFeedbackStatus = async (feedbackId: string, newStatus: FeedbackStatus) => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .update({ status: newStatus })
      .eq('id', feedbackId)
      .select();
      
    if (error) {
      console.error("Error updating feedback status:", error);
      toast.error(`Failed to update status: ${error.message}`);
      return null;
    }
    
    console.log("Feedback status updated successfully:", data);
    toast.success(`Status updated to ${newStatus}`);
    return data[0];
  } catch (error) {
    console.error("Unexpected error updating feedback status:", error);
    toast.error("An unexpected error occurred");
    return null;
  }
};
