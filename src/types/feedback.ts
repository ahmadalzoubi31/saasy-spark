
export interface Feedback {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  rating: number;
  feedback: string;
  product_name?: string;
  url?: string;
  user_agent?: string;
  status: string;
  created_at: string;
}

export interface FeedbackReply {
  id: string;
  feedback_id: string;
  message: string;
  user_id?: string;
  created_at: string;
}

export type FeedbackStatus = "New" | "In Progress" | "Reviewed" | "Resolved";

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}
