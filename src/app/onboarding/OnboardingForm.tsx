"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateUserProfile } from "./actions";
import LoadingButton from "@/components/LoadingButton";
import { Session } from "next-auth";

interface Field {
  id: string;
  name: string;
  description?: string;
}

export default function OnboardingForm({ user }: { user: Session["user"] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [userType, setUserType] = useState<"STUDENT" | "TUTOR" | "ORGANIZATION">("STUDENT");
  const [error, setError] = useState<string | null>(null);

  // Fetch actual fields from the database
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch('/api/fields');
        if (response.ok) {
          const data = await response.json();
          setFields(data.fields || []);
        } else {
          console.error('Failed to fetch fields');
          // Fallback to sample fields if API fails
          setFields([
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
          ]);
        }
      } catch (error) {
        console.error('Error fetching fields:', error);
        // Fallback to sample fields
        setFields([
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
        ]);
      }
    };

    fetchFields();
  }, []);

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
    formData.append("userType", userType);
    
    console.log("🔄 1. Submitting onboarding form...", {
      fields: selectedFields,
      bioLength: bio.length,
      userType
    });
    
    const result = await updateUserProfile(formData);
    
    console.log("📨 2. Server response:", result);
    console.log("🔍 3. Response analysis:", {
      hasResult: !!result,
      hasError: result?.error,
      hasSuccess: result?.success,
      resultKeys: result ? Object.keys(result) : 'no result'
    });
    
    if (result?.error) {
      console.log("❌ 4. Setting error:", result.error);
      setError(result.error);
    } else if (result?.success) {
      console.log("✅ 5. Success! Redirecting to dashboard...");
      // Force redirect
      window.location.href = "/dashboard";
    } else {
      console.log("⚠️  6. Unexpected response");
      setError("Unexpected response from server");
    }
  } catch (err) {
    console.error("💥 7. Unexpected error:", err);
    setError("An unexpected error occurred. Please try again.");
  } finally {
    console.log("🏁 8. Finally block - setting isLoading to false");
    setIsLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {error && (
        <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* User Type Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          What best describes you?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              userType === "STUDENT" 
                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" 
                : "border-gray-200 dark:border-gray-700 hover:border-orange-300"
            }`}
            onClick={() => setUserType("STUDENT")}
          >
            <div className="font-medium text-gray-800 dark:text-gray-200">Student</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              I'm here to learn and study
            </div>
          </div>
          
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              userType === "TUTOR" 
                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" 
                : "border-gray-200 dark:border-gray-700 hover:border-orange-300"
            }`}
            onClick={() => setUserType("TUTOR")}
          >
            <div className="font-medium text-gray-800 dark:text-gray-200">Tutor</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              I want to help others learn
            </div>
          </div>
          
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              userType === "ORGANIZATION" 
                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" 
                : "border-gray-200 dark:border-gray-700 hover:border-orange-300"
            }`}
            onClick={() => setUserType("ORGANIZATION")}
          >
            <div className="font-medium text-gray-800 dark:text-gray-200">Organization</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              School, company, or institution
            </div>
          </div>
        </div>
      </div>

      {/* Fields of Study */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Select your fields of interest
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose at least one field to help us personalize your experience
        </p>
        
        {fields.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map((field) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={field.id}
                  checked={selectedFields.includes(field.id)}
                  onCheckedChange={() => handleFieldToggle(field.id)}
                  className="border-orange-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                />
                <Label 
                  htmlFor={field.id}
                  className="text-gray-700 dark:text-gray-300 cursor-pointer flex-1"
                >
                  {field.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300 text-lg font-medium">
          Bio (optional)
        </Label>
        <Textarea
          id="bio"
          placeholder="Tell us a bit about yourself, your interests, or what you hope to achieve..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="min-h-[120px] border-orange-200 dark:border-orange-800 focus:ring-2 focus:ring-orange-500 text-lg"
          maxLength={500}
        />
        <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
          {bio.length}/500 characters
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <LoadingButton
          type="submit"
          loading={isLoading}
          disabled={selectedFields.length === 0}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg text-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Setting up your profile..." : "Complete Profile & Continue"}
        </LoadingButton>
      </div>
    </form>
  );
}