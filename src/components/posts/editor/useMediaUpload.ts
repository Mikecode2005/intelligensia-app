// useMediaUpload.ts - COMPLETELY FIXED VERSION
import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useState, useCallback } from "react";

export interface Attachment {
  file: File;
  previewUrl: string;
  url?: string; // ⭐⭐ CHANGED: Use URL instead of mediaId
  type?: string; // ⭐⭐ ADDED: File type
  isUploading: boolean;
  uploadProgress?: number;
}

export default function useMediaUpload() {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      console.log("🔄 Starting upload for files:", files.map(f => f.name));
      
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();
        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          {
            type: file.type,
          },
        );
      });

      // Create preview URLs and add new attachments
      const newAttachments: Attachment[] = renamedFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        isUploading: true,
        uploadProgress: 0
      }));

      setAttachments((prev) => [...prev, ...newAttachments]);
      setIsUploading(true);
      
      console.log("✅ Added new attachments:", newAttachments.map(a => a.file.name));
      return renamedFiles;
    },

    onUploadProgress: (progress) => {
      console.log("📊 Upload progress:", progress);
      setAttachments(prev => 
        prev.map(att => 
          att.isUploading 
            ? { ...att, uploadProgress: progress } 
            : att
        )
      );
    },

    onClientUploadComplete(res) {
      console.log("✅ Upload complete, response:", res);
      
      if (!res || res.length === 0) {
        console.error("❌ No response from upload");
        toast({
          variant: "destructive",
          description: "Upload failed - no response received",
        });
        setIsUploading(false);
        return;
      }

      setAttachments((prev) =>
        prev.map((attachment) => {
          const uploadResult = res.find((r) => r.name === attachment.file.name);

          if (!uploadResult) {
            console.warn("❌ No upload result for:", attachment.file.name);
            return { ...attachment, isUploading: false };
          }

          // ⭐⭐ FIXED: Use URL instead of mediaId ⭐⭐
          const fileUrl = uploadResult.url;
          const fileType = uploadResult.type || (attachment.file.type.startsWith('image/') ? 'image' : 'video');

          console.log("📤 File:", attachment.file.name, "-> URL:", fileUrl);

          if (!fileUrl) {
            console.error("❌ No URL in response for:", attachment.file.name);
            return { ...attachment, isUploading: false };
          }

          console.log("✅ Upload completed successfully for:", attachment.file.name);
          return {
            ...attachment,
            url: fileUrl, // ⭐⭐ Store URL instead of mediaId
            type: fileType, // ⭐⭐ Store file type
            isUploading: false,
            uploadProgress: 100,
          };
        })
      );

      setIsUploading(false);
      
      const successfulUploads = res.filter(r => r.url).length;
      if (successfulUploads > 0) {
        toast({
          description: `Successfully uploaded ${successfulUploads} file(s)`,
        });
      }
    },

    onUploadError(e) {
      console.error("❌ Upload error:", e);
      
      // Clean up object URLs for failed uploads
      setAttachments((prev) => {
        const failedAttachments = prev.filter((a) => a.isUploading);
        failedAttachments.forEach(att => URL.revokeObjectURL(att.previewUrl));
        return prev.filter((a) => !a.isUploading);
      });
      
      setIsUploading(false);
      toast({
        variant: "destructive",
        description: `Upload failed: ${e.message}`,
      });
    },
  });

  const handleStartUpload = useCallback((files: File[]) => {
    console.log("🔄 handleStartUpload called with:", files.map(f => f.name));
    
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait for the current upload to finish.",
      });
      return;
    }

    if (attachments.length + files.length > 5) {
      toast({
        variant: "destructive",
        description: "You can only upload up to 5 attachments per post.",
      });
      return;
    }

    startUpload(files);
  }, [isUploading, attachments.length, startUpload, toast]);

  const removeAttachment = useCallback((fileName: string) => {
    console.log("🗑️ Removing attachment:", fileName);
    setAttachments((prev) => {
      const attachmentToRemove = prev.find(a => a.file.name === fileName);
      if (attachmentToRemove?.previewUrl) {
        URL.revokeObjectURL(attachmentToRemove.previewUrl);
      }
      return prev.filter((a) => a.file.name !== fileName);
    });
  }, []);

  const reset = useCallback(() => {
    console.log("🔄 Resetting media upload state");
    // Clean up all object URLs
    attachments.forEach(att => {
      if (att.previewUrl) {
        URL.revokeObjectURL(att.previewUrl);
      }
    });
    setAttachments([]);
    setIsUploading(false);
  }, [attachments]);

  // Get successfully uploaded attachments with URLs
  const uploadedAttachments = attachments.filter(att => att.url && !att.isUploading);

  // Calculate overall upload progress
  const uploadProgress = attachments.length > 0 
    ? attachments.reduce((sum, att) => sum + (att.uploadProgress || 0), 0) / attachments.length
    : 0;

  return {
    startUpload: handleStartUpload,
    attachments,
    uploadedAttachments, // ⭐⭐ ADDED: Filtered list of completed uploads
    isUploading,
    uploadProgress: Math.round(uploadProgress),
    removeAttachment,
    reset,
  };
}

export type { Attachment };