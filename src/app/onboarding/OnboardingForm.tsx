"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateUserProfile } from "./actions";
import { Session } from "next-auth";

interface Field {
  id: string;
  name: string;
  description?: string;
}

type Goal = "ace-exams" | "build-research" | "find-peers" | "career-growth";

export default function OnboardingForm({ user }: { user: Session["user"] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [bio, setBio] = useState("");
  const [userType, setUserType] = useState<"STUDENT" | "TUTOR" | "ORGANIZATION">("STUDENT");
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch actual fields from the database
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch('/api/fields');
        if (response.ok) {
          const data = await response.json();
          setFields(data.fields || []);
        } else {
          loadFallbackFields();
        }
      } catch (error) {
        console.error('Error fetching fields:', error);
        loadFallbackFields();
      }
    };

    fetchFields();
  }, []);

  const loadFallbackFields = () => {
    setFields([
      { id: "quantum-physics", name: "Quantum Physics" },
      { id: "creative-writing", name: "Creative Writing" },
      { id: "macroeconomics", name: "Macroeconomics" },
      { id: "artificial-intelligence", name: "Artificial Intelligence" },
      { id: "art-history", name: "Art History" },
      { id: "molecular-biology", name: "Molecular Biology" },
      { id: "environmental-science", name: "Environmental Science" },
      { id: "digital-marketing", name: "Digital Marketing" },
      { id: "philosophy", name: "Philosophy" },
      { id: "calculus", name: "Calculus" },
      { id: "sociology", name: "Sociology" },
      { id: "graphic-design", name: "Graphic Design" },
      { id: "game-theory", name: "Game Theory" },
      { id: "ethical-hacking", name: "Ethical Hacking" },
      { id: "computer-science", name: "Computer Science" },
      { id: "engineering", name: "Engineering" },
      { id: "medicine", name: "Medicine & Health Sciences" },
      { id: "business", name: "Business & Economics" },
      { id: "law", name: "Law" },
      { id: "psychology", name: "Psychology" },
    ]);
  };

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(current => 
      current.includes(fieldId)
        ? current.filter(id => id !== fieldId)
        : [...current, fieldId]
    );
  };

  const filteredFields = fields.filter(field =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isStep1Valid = selectedFields.length > 0;
  const isStep2Valid = selectedGoal !== null;
  const isStep3Valid = true;

  const handleNext = () => {
    if (currentStep === 1 && !isStep1Valid) {
      setError("Please select at least one interest");
      return;
    }
    if (currentStep === 2 && !isStep2Valid) {
      setError("Please select your mission");
      return;
    }
    setError(null);
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!isStep1Valid || !isStep2Valid) {
      setError("Please complete all steps");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fields", JSON.stringify(selectedFields));
      formData.append("goal", selectedGoal || "");
      formData.append("bio", bio);
      formData.append("userType", userType);

      const result = await updateUserProfile(formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        window.location.href = "/dashboard";
      } else {
        setError("Unexpected response from server");
      }
    } catch (err) {
      console.error("Error during onboarding:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      {/* Progress Header */}
      <div className="p-8 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col gap-3">
          <div className="flex gap-6 justify-between items-end">
            <div className="flex flex-col">
              <span className="text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
                Onboarding
              </span>
              <p className="text-gray-900 dark:text-white text-xl font-bold leading-normal">
                Step {currentStep} of 3: {currentStep === 1 ? "Interests Selection" : currentStep === 2 ? "Mission Selection" : "Mission Review"}
              </p>
            </div>
            <p className="text-gray-700 dark:text-gray-400 text-sm font-semibold leading-normal">
              {Math.round((currentStep / 3) * 100)}% Complete
            </p>
          </div>
          <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-2.5 w-full">
            <div
              className="h-full rounded-full bg-orange-600 transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 min-h-96">
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Step 1: Interests */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-gray-900 dark:text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight mb-4">
                What sparks your curiosity?
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-normal">
                Select the subjects you'd like to follow to personalize your learning journey and research feed.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search interests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-full border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:border-orange-500 focus:ring-0 outline-none"
                />
              </div>

              <div className="flex gap-3 flex-wrap justify-center py-6">
                {filteredFields.map((field) => (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => handleFieldToggle(field.id)}
                    className={`flex h-11 cursor-pointer transition-all shrink-0 items-center justify-center gap-x-2 rounded-full px-6 font-medium text-sm ${
                      selectedFields.includes(field.id)
                        ? "bg-orange-600 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                    }`}
                  >
                    {selectedFields.includes(field.id) && (
                      <span className="text-lg">✓</span>
                    )}
                    <span>{field.name}</span>
                  </button>
                ))}
              </div>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                Selected: {selectedFields.length} interest{selectedFields.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Mission */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-gray-900 dark:text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight mb-4">
                What's your mission?
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-normal">
                Tell us what you want to achieve so we can tailor your experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Ace my exams */}
              <button
                type="button"
                onClick={() => setSelectedGoal("ace-exams")}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedGoal === "ace-exams"
                    ? "border-orange-600 bg-orange-50/50 dark:bg-orange-900/20"
                    : "border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-800"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white text-xl mb-3">
                  🎓
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Ace my exams</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Personalized study plans and flashcards for your courses.
                </p>
              </button>

              {/* Build Research */}
              <button
                type="button"
                onClick={() => setSelectedGoal("build-research")}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedGoal === "build-research"
                    ? "border-orange-600 bg-orange-50/50 dark:bg-orange-900/20"
                    : "border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-800"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white text-xl mb-3">
                  🔬
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Build Research</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Find collaborators and access premium academic journals.
                </p>
              </button>

              {/* Find Peers */}
              <button
                type="button"
                onClick={() => setSelectedGoal("find-peers")}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedGoal === "find-peers"
                    ? "border-orange-600 bg-orange-50/50 dark:bg-orange-900/20"
                    : "border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-800"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white text-xl mb-3">
                  👥
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Find Peers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Connect with like-minded students and join study groups.
                </p>
              </button>

              {/* Career Growth */}
              <button
                type="button"
                onClick={() => setSelectedGoal("career-growth")}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedGoal === "career-growth"
                    ? "border-orange-600 bg-orange-50/50 dark:bg-orange-900/20"
                    : "border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-800"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white text-xl mb-3">
                  🚀
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Career Growth</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Build skills and find internship opportunities in your field.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-gray-900 dark:text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight mb-4">
                Almost there!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-normal">
                Review your selections or add optional information about yourself.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Review Interests */}
              <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Your Interests ({selectedFields.length})
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedFields.map((fieldId) => {
                    const field = fields.find((f) => f.id === fieldId);
                    return (
                      <div key={fieldId} className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                        {field?.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Goal */}
              <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  Your Mission
                </h3>
                <div className="text-gray-700 dark:text-gray-300">
                  {selectedGoal === "ace-exams" && "🎓 Ace my exams"}
                  {selectedGoal === "build-research" && "🔬 Build Research"}
                  {selectedGoal === "find-peers" && "👥 Find Peers"}
                  {selectedGoal === "career-growth" && "🚀 Career Growth"}
                </div>
              </div>

              {/* Bio Optional */}
              <div className="space-y-2">
                <label htmlFor="bio" className="text-gray-900 dark:text-white font-medium">
                  Bio (optional)
                </label>
                <textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 500))}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:border-orange-500 focus:ring-0 outline-none resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="text-sm text-gray-600 dark:text-gray-400 text-right">
                  {bio.length}/500
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={currentStep === 1 || isLoading}
          className="px-8 py-3 rounded-full font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="flex items-center gap-6">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            You can change these later
          </span>
          <button
            onClick={currentStep === 3 ? handleSubmit : handleNext}
            disabled={
              isLoading ||
              (currentStep === 1 && !isStep1Valid) ||
              (currentStep === 2 && !isStep2Valid)
            }
            className="px-12 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-bold shadow-lg shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                Setting up...
              </>
            ) : currentStep === 3 ? (
              <>
                Complete ✓
              </>
            ) : (
              <>
                Continue →
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}