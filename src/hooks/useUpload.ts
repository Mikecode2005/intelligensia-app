import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  
  const { startUpload } = useUploadThing("attachment", {
    onClientUploadComplete: (data) => {
      console.log("✅ Upload completed:", data);
      setIsUploading(false);
      return data;
    },
    onUploadError: (error) => {
      console.error("❌ Upload error:", error);
      setIsUploading(false);
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
  });

  return {
    startUpload,
    isUploading
  };
}