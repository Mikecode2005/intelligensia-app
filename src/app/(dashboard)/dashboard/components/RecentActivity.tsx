import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityIcon } from "lucide-react";

interface RecentActivityProps {
  userId: string;
}

export default async function RecentActivity({ userId }: RecentActivityProps) {
  // In a real app, you would fetch actual activity data from the database
  // For now, we'll use placeholder data
  const activities = [
    {
      id: 1,
      type: "assignment",
      title: "Completed Introduction to Machine Learning",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 2,
      type: "classroom",
      title: "Joined Advanced Mathematics classroom",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    },
    {
      id: 3,
      type: "scholarship",
      title: "Applied for Engineering Excellence Scholarship",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: 4,
      type: "studygroup",
      title: "Created Data Science Study Group",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: 5,
      type: "post",
      title: "Posted a question about Neural Networks",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  ];

  // Function to format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Function to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return "📝";
      case "classroom":
        return "🏫";
      case "scholarship":
        return "🎓";
      case "studygroup":
        return "👥";
      case "post":
        return "💬";
      default:
        return "📌";
    }
  };

  return (
    <Card className="border-orange-100 dark:border-orange-900/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <ActivityIcon className="h-5 w-5 text-orange-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No recent activity to display
            </p>
          ) : (
            activities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-gray-200">{activity.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}