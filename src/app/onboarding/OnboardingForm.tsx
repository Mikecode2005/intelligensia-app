"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateUserProfile } from "./actions";
import LoadingButton from "@/components/LoadingButton";
import { Session } from "next-auth";

// Sample fields of study - these would come from your database in production
const FIELDS_OF_STUDY = [
  { id: "computer-science", name: "Computer Science" },
  { id: "engineering", name: "Engineering" },
  { id: "medicine", name: "Medicine & Health Sciences" },
  { id: "business", name: "Business & Economics" },
  { id: "arts", name: "Arts & Humanities" },
  { id: "social-sciences", name: "Social Sciences" },
  { id: "natural-sciences", name: "Natural Sciences" },
  { id: "mathematics", name: "Mathematics" },
  { id: "education", name: "Education" },
  { id: "law", name: "Law" },
];

export default function OnboardingForm({ user }: { user: Session["user"] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(current => 
      current.includes(fieldId)
        ? current.filter(id => id !== fieldId)
        : [...current, fieldId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFields.length === 0) {
      setError("Please select at least one field of interest");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("fields", JSON.stringify(selectedFields));
      formData.append("bio", bio);
      
      const result = await updateUserProfile(formData);
      
      if (result && "error" in result) {
        setError(result.error);
      }
      // Redirect is handled in the server action
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Select your fields of interest
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This helps us personalize your experience and connect you with relevant content and people.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FIELDS_OF_STUDY.map((field) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Checkbox 
                id={field.id}
                checked={selectedFields.includes(field.id)}
                onCheckedChange={() => handleFieldToggle(field.id)}
                className="border-orange-400 text-orange-600"
              />
              <Label 
                htmlFor={field.id}
                className="text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {field.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300">
          Bio (optional)
        </Label>
        <Textarea
          id="bio"
          placeholder="Tell us a bit about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="min-h-[100px] border-orange-200 dark:border-orange-800 focus:ring-2 focus:ring-orange-500"
        />
      </div>
      
      <div className="flex justify-end">
        <LoadingButton
          type="submit"
          loading={isLoading}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
        >
          {isLoading ? "Saving..." : "Complete Profile"}
        </LoadingButton>
      </div>
    </form>
  );
}