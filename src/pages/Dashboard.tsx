
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Feedback, FeedbackReply } from "@/types/feedback";

const Dashboard = () => {
  const { user, loading, apiKey, generateApiKey } = useAuth();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [replies, setReplies] = useState<FeedbackReply[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [replyMessage, setReplyMessage] = useState("");
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [widgetCode, setWidgetCode] = useState<string>("");

  // Redirect to auth page if not logged in
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (user && apiKey) {
      fetchFeedbackAndReplies();
      generateWidgetCode();
    }
  }, [user, apiKey, activeTab]);

  const fetchFeedbackAndReplies = async () => {
    setIsFetchingData(true);
    try {
      // Fetch feedback based on the user's API key
      let query = supabase.from('feedback')
        .select('*');
        
      // Filter by API key if available (no longer trying to filter by api_key column on feedback table)
      // The api_key is in the profiles table, not in the feedback table

      if (activeTab !== 'all') {
        query = query.eq('status', activeTab);
      }

      const { data: feedbackData, error: feedbackError } = await query.order('created_at', { ascending: false });

      if (feedbackError) throw feedbackError;
      
      // Only show feedback that belongs to the current user's API key
      if (apiKey && feedbackData) {
        const filteredFeedback = feedbackData.filter(item => item.api_key === apiKey);
        setFeedback(filteredFeedback);
      } else {
        setFeedback([]);
      }

      // Fetch all replies
      const { data: repliesData, error: repliesError } = await supabase
        .from('feedback_replies')
        .select('*');

      if (repliesError) throw repliesError;
      setReplies(repliesData || []);
    } catch (error: any) {
      toast.error(`Error fetching data: ${error.message}`);
      console.error('Error fetching data:', error);
    } finally {
      setIsFetchingData(false);
    }
  };

  const generateWidgetCode = () => {
    if (!apiKey) return;

    const code = `<script 
  src="https://saasy-spark.lovable.app/widget.js" 
  data-api-key="${apiKey}" 
  data-position="bottom-right" 
  data-dark-mode="false" 
  data-product-name="Your Product Name">
</script>`;
    
    setWidgetCode(code);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setFeedback(feedback.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));

      toast.success(`Status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(`Error updating status: ${error.message}`);
    }
  };

  const handleReply = async (feedbackId: string) => {
    if (!replyMessage.trim()) {
      toast.error("Reply message cannot be empty");
      return;
    }

    setIsReplying(true);
    try {
      const { data, error } = await supabase
        .from('feedback_replies')
        .insert({
          feedback_id: feedbackId,
          message: replyMessage,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setReplies([...replies, data]);
      setReplyMessage("");
      setActiveFeedbackId(null);
      toast.success("Reply sent successfully");
    } catch (error: any) {
      toast.error(`Error sending reply: ${error.message}`);
    } finally {
      setIsReplying(false);
    }
  };

  const handleGenerateApiKey = async () => {
    try {
      await generateApiKey();
      setTimeout(() => generateWidgetCode(), 100);
    } catch (error) {
      // Error already handled in generateApiKey function
    }
  };

  const copyWidgetCode = () => {
    navigator.clipboard.writeText(widgetCode);
    toast.success("Widget code copied to clipboard");
  };

  const StatusBadge = ({ status }: { status: string }) => {
    let color;
    switch (status.toLowerCase()) {
      case 'new':
        color = 'bg-blue-100 text-blue-800';
        break;
      case 'in progress':
        color = 'bg-yellow-100 text-yellow-800';
        break;
      case 'resolved':
        color = 'bg-green-100 text-green-800';
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
    }
    return <Badge className={color}>{status}</Badge>;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={i < rating ? "currentColor" : "none"}
            stroke={i < rating ? "currentColor" : "currentColor"}
            className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Manage your customer feedback</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Feedback</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{feedback.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
            <CardDescription>From all feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {feedback.length
                ? (
                    feedback.reduce((sum, item) => sum + item.rating, 0) /
                    feedback.length
                  ).toFixed(1)
                : "0.0"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Responses</CardTitle>
            <CardDescription>Feedback without replies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {
                feedback.filter(
                  (item) =>
                    !replies.some((reply) => reply.feedback_id === item.id)
                ).length
              }
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
              <CardDescription>View and manage customer feedback</CardDescription>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="New">New</TabsTrigger>
                  <TabsTrigger value="In Progress">In Progress</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {isFetchingData ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2">Loading feedback...</p>
                </div>
              ) : feedback.length > 0 ? (
                <div className="space-y-4">
                  {feedback.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">
                              {item.first_name} {item.last_name}
                            </h3>
                            <p className="text-sm text-gray-500">{item.email}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <StatusBadge status={item.status} />
                            <div className="text-sm text-gray-500">
                              {new Date(item.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="mb-2">{renderStars(item.rating)}</div>
                        <p className="mb-4">{item.feedback}</p>
                        
                        {/* Product info if available */}
                        {item.product_name && (
                          <div className="text-sm text-gray-500 mb-2">
                            Product: {item.product_name}
                          </div>
                        )}
                        
                        {/* Replies section */}
                        <div className="mt-4">
                          {replies
                            .filter((reply) => reply.feedback_id === item.id)
                            .map((reply) => (
                              <div
                                key={reply.id}
                                className="bg-gray-50 p-3 rounded-md mb-2"
                              >
                                <div className="flex justify-between">
                                  <span className="font-medium">Your reply</span>
                                  <span className="text-sm text-gray-500">
                                    {new Date(reply.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="mt-1 text-gray-700">{reply.message}</p>
                              </div>
                            ))}
                        </div>
                        
                        <div className="flex justify-between mt-4">
                          <Select
                            defaultValue={item.status}
                            onValueChange={(value) => handleStatusChange(item.id, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="New">New</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {activeFeedbackId === item.id ? (
                            <Button 
                              variant="outline" 
                              onClick={() => setActiveFeedbackId(null)}
                            >
                              Cancel
                            </Button>
                          ) : (
                            <Button onClick={() => setActiveFeedbackId(item.id)}>
                              Reply
                            </Button>
                          )}
                        </div>
                        
                        {activeFeedbackId === item.id && (
                          <div className="mt-4">
                            <Textarea
                              className="mb-2"
                              placeholder="Write your reply..."
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                            />
                            <Button 
                              onClick={() => handleReply(item.id)} 
                              disabled={isReplying}
                            >
                              {isReplying ? "Sending..." : "Send Reply"}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No feedback found.</p>
                  {!apiKey && (
                    <p className="mt-2">
                      Generate an API key and add the widget to your website to collect feedback.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Widget Code</CardTitle>
              <CardDescription>Add to your website to collect feedback</CardDescription>
            </CardHeader>
            <CardContent>
              {apiKey ? (
                <>
                  <p className="text-sm mb-3">
                    Copy and paste this code snippet into your website to add the
                    feedback widget.
                  </p>
                  <div className="relative">
                    <pre className="bg-gray-50 p-3 rounded-md text-sm overflow-x-auto border mb-3">
                      {widgetCode}
                    </pre>
                    <Button
                      variant="outline"
                      className="absolute top-2 right-2"
                      size="sm"
                      onClick={copyWidgetCode}
                    >
                      Copy
                    </Button>
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline" 
                    onClick={handleGenerateApiKey}
                  >
                    Generate New API Key
                  </Button>
                </>
              ) : (
                <div className="text-center">
                  <p className="mb-4">Generate an API key to get your widget code.</p>
                  <Button onClick={handleGenerateApiKey}>Generate API Key</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Customize your feedback widget</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Configure how the feedback widget appears on your website.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product Name
                  </label>
                  <Input placeholder="Your Product Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Position
                  </label>
                  <Select defaultValue="bottom-right">
                    <SelectTrigger>
                      <SelectValue placeholder="Widget Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Theme
                  </label>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue placeholder="Widget Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
