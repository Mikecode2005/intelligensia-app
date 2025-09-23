"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, BriefcaseIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

interface InternshipCardProps {
  internship: {
    id: string;
    title: string;
    description: string;
    company: string;
    location: string;
    isRemote: boolean;
    startDate: Date;
    endDate: Date;
    deadline: Date;
    requirements: string;
    organizationId: string;
    fieldId: string;
    fieldName: string;
    logoUrl: string;
  };
}

export default function InternshipCard({ internship }: InternshipCardProps) {
  // Calculate days remaining until deadline
  const daysRemaining = Math.ceil(
    (internship.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Calculate internship duration in months
  const durationInDays = Math.ceil(
    (internship.endDate.getTime() - internship.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const durationInMonths = Math.round(durationInDays / 30);
  
  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-colors">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Company Logo */}
          <div className="md:w-24 h-24 bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
            <div className="relative w-16 h-16">
              <Image
                src={internship.logoUrl}
                alt={internship.company}
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          {/* Internship Details */}
          <div className="flex-1 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {internship.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <BriefcaseIcon className="h-4 w-4 text-orange-500" />
                  <span>{internship.company}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-600"></span>
                  <span className="inline-flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4 text-orange-500" />
                    {internship.location}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                {internship.isRemote && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                    Remote
                  </span>
                )}
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-full">
                  {internship.fieldName}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
              {internship.description}
            </p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mb-4">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <CalendarIcon className="h-4 w-4 text-orange-500" />
                <span>
                  {format(internship.startDate, 'MMM d, yyyy')} - {format(internship.endDate, 'MMM d, yyyy')}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <ClockIcon className="h-4 w-4 text-orange-500" />
                <span>{durationInMonths} {durationInMonths === 1 ? 'month' : 'months'}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Application deadline: <span className="font-medium text-gray-700 dark:text-gray-300">{format(internship.deadline, 'MMM d, yyyy')}</span>
                </div>
                <div className="w-full max-w-[200px] bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`h-full rounded-full ${
                      daysRemaining < 7 
                        ? 'bg-red-500' 
                        : daysRemaining < 30 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, (daysRemaining / 90) * 100))}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950"
                  asChild
                >
                  <Link href={`/internships/${internship.id}`}>
                    View Details
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  asChild
                >
                  <Link href={`/internships/${internship.id}/apply`}>
                    Apply Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}