import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageTransition from "@/components/layout/PageTransition";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import FeedbackWidget from "@/components/FeedbackWidget";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Feedback, FeedbackReply, FeedbackStatus } from "@/types/feedback";
import { createSampleFeedback } from "@/utils/createSampleFeedback";
import { updateFeedbackStatus } from "@/utils/updateFeedbackStatus";
import { exportFeedbackToCsv } from "@/utils/exportFeedback";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

const data = [
  { name: "Jan", value: 25 },
  { name: "Feb", value: 30 },
  { name: "Mar", value: 45 },
  { name: "Apr", value: 40 },
  { name: "May", value: 55 },
  { name: "Jun", value: 65 },
  { name: "Jul", value: 75 },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, profile } = useAuth();
  
  const [widgetSettings, setWidgetSettings] = useState({
    productName: "Feedback SaaS",
    position: "bottom-right" as "bottom-right" | "bottom-left" | "top-right" | "top-left",
    darkMode: false,
  });
  
  const [refreshKey, setRefreshKey] = useState(0);
  
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [feedbackReplies, setFeedbackReplies] = useState<FeedbackReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [replyText, setReplyText] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FeedbackStatus | "All">("All");
  const [filterRating, setFilterRating] = useState<number | "All">("All");
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<FeedbackStatus>("New");

  // Fetch feedback data
  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      setFetchError(null);
      
      try {
        console.log("Fetching feedback data...");
        
        const { data: feedback, error } = await supabase
          .from('feedback')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Feedback fetch error:', error);
          setFetchError(`Failed to fetch feedback: ${error.message}`);
          throw error;
        }
        
        console.log("Feedback data:", feedback);
        
        const { data: replies, error: repliesError } = await supabase
          .from('feedback_replies')
          .select('*, profiles:user_id(*)')
          .order('created_at', { ascending: true });
          
        if (repliesError) {
          console.error('Replies fetch error:', repliesError);
          setFetchError(`Failed to fetch replies: ${repliesError.message}`);
          throw repliesError;
        }
        
        console.log("Replies data:", replies);
        
        // For testing: If no data is returned, create sample data
        if (!feedback || feedback.length === 0) {
          // Create sample feedback entry
          const sampleFeedback = {
            id: "sample-id-1",
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
            rating: 4,
            status: "New",
            feedback: "This is a sample feedback entry for testing purposes.",
            created_at: new Date().toISOString()
          };
          
          console.log("No feedback found, using sample data:", [sampleFeedback]);
          setFeedbackData([sampleFeedback as Feedback]);
        } else {
          setFeedbackData(feedback || []);
        }
        
        setFeedbackReplies(replies || []);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        toast.error('Failed to load feedback data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, []);

  const handleWidgetSettingChange = (
    field: keyof typeof widgetSettings,
    value: string | boolean
  ) => {
    setWidgetSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleSaveWidgetSettings = () => {
    setRefreshKey((prev) => prev + 1);
    toast.success("Widget settings saved successfully");
  };
  
  const handleRefreshWidget = () => {
    setRefreshKey((prev) => prev + 1);
    toast.success("Widget refreshed");
  };
  
  const handleReplyClick = (feedback: Feedback) => {
    setCurrentFeedback(feedback);
    setReplyText("");
    setReplyDialogOpen(true);
  };
  
  const handleSendReply = async () => {
    if (!currentFeedback || !replyText.trim() || !user) {
      toast.error("Please enter a reply message");
      return;
    }
    
    try {
      console.log("Sending reply to feedback:", currentFeedback.id);
      
      // Save reply to database
      const { data, error } = await supabase
        .from('feedback_replies')
        .insert({
          feedback_id: currentFeedback.id,
          message: replyText,
          user_id: user.id
        })
        .select('*, profiles:user_id(*)');
        
      if (error) {
        console.error('Error sending reply:', error);
        throw error;
      }
      
      console.log("Reply saved successfully:", data);
      
      // Update local state with new reply
      if (data && data.length > 0) {
        setFeedbackReplies(prev => [...prev, data[0] as FeedbackReply]);
        
        // Also update the status to "In Progress" if it's currently "New"
        if (currentFeedback.status === "New") {
          const updatedFeedback = await updateFeedbackStatus(currentFeedback.id, "In Progress");
          if (updatedFeedback) {
            setFeedbackData(prev => 
              prev.map(item => item.id === currentFeedback.id ? {...item, status: "In Progress"} : item)
            );
          }
        }
      }
      
      toast.success(`Reply sent to ${currentFeedback.first_name}`);
      setReplyDialogOpen(false);
      setReplyText("");
      
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    }
  };

  const handleStatusChange = (feedbackId: string) => {
    setCurrentFeedback(feedbackData.find(f => f.id === feedbackId) || null);
    setSelectedStatus("New");
    setStatusDialogOpen(true);
  };
  
  const handleUpdateStatus = async () => {
    if (!currentFeedback) return;
    
    const updatedFeedback = await updateFeedbackStatus(currentFeedback.id, selectedStatus);
    if (updatedFeedback) {
      setFeedbackData(prev => 
        prev.map(item => item.id === currentFeedback.id ? {...item, status: selectedStatus} : item)
      );
      setStatusDialogOpen(false);
    }
  };

  const handleExportFeedback = () => {
    // Filter feedback if filters are applied
    let dataToExport = feedbackData;
    
    if (filterStatus !== "All") {
      dataToExport = dataToExport.filter(f => f.status === filterStatus);
    }
    
    if (filterRating !== "All") {
      dataToExport = dataToExport.filter(f => f.rating === filterRating);
    }
    
    exportFeedbackToCsv(dataToExport);
  };

  const handleFilterFeedback = () => {
    setLoading(true);
    
    setTimeout(() => {
      let query = supabase.from('feedback').select('*');
      
      // Apply filters if they're not set to "All"
      if (filterStatus !== "All") {
        query = query.eq('status', filterStatus);
      }
      
      if (filterRating !== "All") {
        query = query.eq('rating', filterRating);
      }
      
      query.order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error filtering feedback:', error);
            toast.error('Failed to filter feedback');
            return;
          }
          
          setFeedbackData(data || []);
          setLoading(false);
        });
    }, 100);
  };
  
  const resetFilters = () => {
    setFilterStatus("All");
    setFilterRating("All");
    
    // Re-fetch all feedback
    setLoading(true);
    supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error resetting filters:', error);
          toast.error('Failed to reset filters');
          return;
        }
        
        setFeedbackData(data || []);
        setLoading(false);
      });
  };

  const getFeedbackReplies = (feedbackId: string) => {
    return feedbackReplies.filter(reply => reply.feedback_id === feedbackId);
  };

  const getWidgetInstallationCode = () => {
    return `<script 
  src="https://saasy-spark.lovable.app/widget.js" 
  data-api-key="YOUR_API_KEY"
  data-position="${widgetSettings.position}"
  data-dark-mode="${widgetSettings.darkMode}"
  data-product-name="${widgetSettings.productName}">
</script>`;
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status Badge component with updated status support
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = () => {
      switch (status) {
        case "New":
          return "bg-blue-100 text-blue-700";
        case "In Progress":
          return "bg-purple-100 text-purple-700";
        case "Reviewed":
          return "bg-yellow-100 text-yellow-700";
        case "Resolved":
          return "bg-green-100 text-green-700";
        default:
          return "bg-gray-100 text-gray-700";
      }
    };
    
    return (
      <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", getStatusColor())}>
        {status}
      </span>
    );
  };
  
  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={cn(
              "w-4 h-4",
              star <= rating ? "text-yellow-400" : "text-gray-300"
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
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

  // Filter function for feedback data
  const getFilteredFeedback = () => {
    return feedbackData.filter(feedback => {
      // Apply status filter if not set to "All"
      if (filterStatus !== "All" && feedback.status !== filterStatus) {
        return false;
      }
      
      // Apply rating filter if not set to "All"
      if (filterRating !== "All" && feedback.rating !== filterRating) {
        return false;
      }
      
      return true;
    });
  };

  // Get profile name for replies
  const getReplyAuthorName = (reply: FeedbackReply) => {
    if (!reply.profiles) return "Admin";
    
    const replyProfile = reply.profiles as any;
    return replyProfile.first_name && replyProfile.last_name 
      ? `${replyProfile.first_name} ${replyProfile.last_name}`
      : replyProfile.email || "Admin";
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
                  F
                </div>
                <span className="font-semibold">Feedback</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80",
                  activeTab === "overview" ? "text-foreground" : "text-foreground/60"
                )}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </Link>
              <Link
                to="/dashboard"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80",
                  activeTab === "feedback" ? "text-foreground" : "text-foreground/60"
                )}
                onClick={() => setActiveTab("feedback")}
              >
                Feedback
              </Link>
              <Link
                to="/dashboard"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80",
                  activeTab === "widget" ? "text-foreground" : "text-foreground/60"
                )}
                onClick={() => setActiveTab("widget")}
              >
                Widget
              </Link>
              <Link
                to="/dashboard"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80",
                  activeTab === "settings" ? "text-foreground" : "text-foreground/60"
                )}
                onClick={() => setActiveTab("settings")}
              >
                Settings
              </Link>
            </nav>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
              </Button>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  {profile?.first_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        <main className="flex-1 container py-8">
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {profile?.first_name || "Admin"}! Here's what's happening with your feedback.
                </p>
              </div>
              <TabsList className="md:hidden">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                <TabsTrigger value="widget">Widget</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </div>
            
            {/* Debug information for fetching status */}
            {fetchError && (
              <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-md text-red-700">
                <p className="font-bold">Error fetching data:</p>
                <p>{fetchError}</p>
              </div>
            )}
            
            <TabsContent value="overview" className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-panel-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Feedback
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 text-muted-foreground"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                      />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{feedbackData.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500 font-medium">+12.4%</span>{" "}
                      from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="glass-panel-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Average Rating
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 text-muted-foreground"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {feedbackData.length > 0 
                        ? (feedbackData.reduce((sum, item) => sum + item.rating, 0) / feedbackData.length).toFixed(1) 
                        : "N/A"}
                    </div>
                    <div className="flex mt-1">
                      <RatingStars rating={feedbackData.length > 0 
                        ? Math.round(feedbackData.reduce((sum, item) => sum + item.rating, 0) / feedbackData.length)
                        : 0} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-panel-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Response Rate
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 text-muted-foreground"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {feedbackData.length > 0 
                        ? `${Math.round((feedbackData.filter(f => 
                            feedbackReplies.some(r => r.feedback_id === f.id)
                          ).length / feedbackData.length) * 100)}%` 
                        : "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500 font-medium">+3.2%</span>{" "}
                      from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="glass-panel-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Users
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 text-muted-foreground"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                      />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Set(feedbackData.map(f => f.email)).size}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500 font-medium">+15.3%</span>{" "}
                      from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-panel-sm">
                  <CardHeader>
                    <CardTitle>Feedback Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="name" 
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#3B82F6"
                          fillOpacity={1}
                          fill="url(#colorValue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="glass-panel-sm">
                  <CardHeader>
                    <CardTitle>Feedback by Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={[
                          { rating: "5 ★", count: feedbackData.filter(f => f.rating === 5).length || 0 },
                          { rating: "4 ★", count: feedbackData.filter(f => f.rating === 4).length || 0 },
                          { rating: "3 ★", count: feedbackData.filter(f => f.rating === 3).length || 0 },
                          { rating: "2 ★", count: feedbackData.filter(f => f.rating === 2).length || 0 },
                          { rating: "1 ★", count: feedbackData.filter(f => f.rating === 1).length || 0 },
                        ]}
                      >
                        <XAxis 
                          dataKey="rating" 
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
