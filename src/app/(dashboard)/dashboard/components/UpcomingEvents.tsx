import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface UpcomingEventsProps {
  userId: string;
}

export default async function UpcomingEvents({ userId }: UpcomingEventsProps) {
  // In a real app, you would fetch actual events data from the database
  // For now, we'll use placeholder data
  const events = [
    {
      id: 1,
      title: "Data Structures Study Group",
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      type: "studygroup",
    },
    {
      id: 2,
      title: "Machine Learning Assignment Due",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      type: "assignment",
    },
    {
      id: 3,
      title: "Web Development Workshop",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      type: "classroom",
    },
    {
      id: 4,
      title: "Tech Scholarship Deadline",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      type: "scholarship",
    },
  ];

  // Function to get event color based on type
  const getEventColor = (type: string) => {
    switch (type) {
      case "assignment":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "classroom":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "scholarship":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "studygroup":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card className="border-orange-100 dark:border-orange-900/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-orange-500" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No upcoming events
            </p>
          ) : (
            events.map((event) => (
              <div 
                key={event.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800 transition-colors"
              >
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
                  <span className="text-xs font-medium">{format(event.date, 'MMM')}</span>
                  <span className="text-lg font-bold leading-none">{format(event.date, 'd')}</span>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getEventColor(event.type)}`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {format(event.date, 'h:mm a')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}