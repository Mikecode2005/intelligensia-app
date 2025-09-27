"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // <-- removed CardFooter import
import { CalendarIcon, DollarSignIcon, BookOpenIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface ScholarshipCardProps {
  scholarship: {
    id: string;
    title: string;
    description: string;
    amount: number;
    // NOTE: deadline may be a string when serialized from server -> client
    deadline: string | Date;
    requirements: string;
    organizationId: string;
    organizationName: string;
    fieldId: string;
    fieldName: string;
  };
}

export default function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  // Ensure deadline is a Date instance (Next serializes Dates to strings)
  const deadline = new Date(scholarship.deadline);
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(scholarship.amount);

  const daysRemaining = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-colors">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-white text-orange-600 rounded-full mb-2">
              {scholarship.fieldName}
            </span>
            <h3 className="text-lg font-bold text-white line-clamp-2">{scholarship.title}</h3>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-white font-bold">{formattedAmount}</div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">{scholarship.description}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-orange-500" />
            <div className="flex justify-between w-full">
              <span className="text-gray-600 dark:text-gray-400">Deadline</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{format(deadline, "MMM d, yyyy")}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <DollarSignIcon className="h-4 w-4 text-orange-500" />
            <div className="flex justify-between w-full">
              <span className="text-gray-600 dark:text-gray-400">Amount</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{formattedAmount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <BookOpenIcon className="h-4 w-4 text-orange-500" />
            <div className="flex justify-between w-full">
              <span className="text-gray-600 dark:text-gray-400">Provider</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{scholarship.organizationName}</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Replaced CardFooter with a simple div to avoid relying on an export that doesn't exist */}
      <div className="p-4 pt-0 flex flex-col gap-2">
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-2">
          <div
            className={`h-full rounded-full ${
              daysRemaining < 7 ? "bg-red-500" : daysRemaining < 30 ? "bg-yellow-500" : "bg-green-500"
            }`}
            style={{ width: `${Math.min(100, Math.max(5, (daysRemaining / 90) * 100))}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>{daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining</span>
        </div>

        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950"
            asChild
          >
            <Link href={`/scholarships/${scholarship.id}`}>View Details</Link>
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            asChild
          >
            <Link href={`/scholarships/${scholarship.id}/apply`}>Apply Now</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
