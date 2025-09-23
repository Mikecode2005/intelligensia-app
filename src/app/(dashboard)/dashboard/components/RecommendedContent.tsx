import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookmarkIcon } from "lucide-react";
import Link from "next/link";

interface RecommendedContentProps {
  fields: {
    id: string;
    name: string;
  }[];
}

export default function RecommendedContent({ fields }: RecommendedContentProps) {
  // In a real app, you would fetch content based on user's fields of interest
  // For now, we'll use placeholder data
  const recommendations = [
    {
      id: 1,
      title: "Introduction to Machine Learning",
      type: "course",
      field: "Computer Science",
      url: "/courses/intro-to-ml",
    },
    {
      id: 2,
      title: "Engineering Excellence Scholarship",
      type: "scholarship",
      field: "Engineering",
      url: "/scholarships/engineering-excellence",
    },
    {
      id: 3,
      title: "Web Development Internship at TechCorp",
      type: "internship",
      field: "Computer Science",
      url: "/internships/web-dev-techcorp",
    },
    {
      id: 4,
      title: "Advanced Mathematics Study Group",
      type: "group",
      field: "Mathematics",
      url: "/groups/advanced-math",
    },
  ];

  // Filter recommendations based on user's fields of interest
  const fieldNames = fields.map(field => field.name.toLowerCase());
  const filteredRecommendations = recommendations.filter(
    rec => fieldNames.some(field => rec.field.toLowerCase().includes(field))
  );

  // If no matching recommendations, show all
  const contentToShow = filteredRecommendations.length > 0 
    ? filteredRecommendations 
    : recommendations;

  // Function to get icon based on content type
  const getContentIcon = (type: string) => {
    switch (type) {
      case "course":
        return "📚";
      case "scholarship":
        return "🎓";
      case "internship":
        return "💼";
      case "group":
        return "👥";
      default:
        return "📌";
    }
  };

  return (
    <Card className="border-orange-100 dark:border-orange-900/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <BookmarkIcon className="h-5 w-5 text-orange-500" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contentToShow.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No recommendations available
            </p>
          ) : (
            contentToShow.map((item) => (
              <Link 
                key={item.id}
                href={item.url}
                className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800 transition-colors"
              >
                <div className="text-2xl">{getContentIcon(item.type)}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-0.5 rounded-full">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.field}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}