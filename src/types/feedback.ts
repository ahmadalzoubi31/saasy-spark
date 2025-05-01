
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
  created_at: string;
}

export interface FeedbackReply {
  id: string;
  feedback_id: string;
  message: string;
  created_at: string;
}
