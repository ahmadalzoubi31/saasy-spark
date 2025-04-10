
import { Feedback } from "@/types/feedback";
import { toast } from "sonner";

export const exportFeedbackToCsv = (feedback: Feedback[]) => {
  try {
    // Define CSV headers
    const headers = [
      "First Name", 
      "Last Name", 
      "Email", 
      "Rating", 
      "Status",
      "Feedback", 
      "Date"
    ];
    
    // Convert feedback data to CSV rows
    const feedbackData = feedback.map(item => [
      item.first_name,
      item.last_name,
      item.email,
      item.rating,
      item.status,
      `"${item.feedback.replace(/"/g, '""')}"`, // Escape quotes in feedback text
      new Date(item.created_at).toLocaleDateString()
    ]);
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...feedbackData.map(row => row.join(','))
    ].join('\n');
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `feedback_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Feedback data exported successfully");
  } catch (error) {
    console.error("Error exporting feedback data:", error);
    toast.error("Failed to export feedback data");
  }
};
