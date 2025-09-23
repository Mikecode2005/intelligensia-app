"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function JoinClassroomDialog({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!joinCode.trim()) {
      setError("Please enter a class code");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // In a real app, you would make an API call to join the classroom
      // For now, we'll simulate a successful join after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close the dialog and redirect to the classroom page
      setOpen(false);
      router.push(`/classrooms/1`); // Replace with actual classroom ID
      router.refresh();
    } catch (err) {
      console.error("Error joining classroom:", err);
      setError("Failed to join classroom. Please check the code and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Join a Classroom
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Enter the class code provided by your teacher to join a classroom.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="join-code" className="text-gray-700 dark:text-gray-300">
              Class Code
            </Label>
            <Input
              id="join-code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter class code (e.g., ABC123)"
              className="border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-500"
              disabled={isLoading}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="border-gray-200 dark:border-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isLoading ? "Joining..." : "Join Classroom"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}