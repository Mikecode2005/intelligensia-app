// components/PostEditor.tsx
"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import LoadingButton from "@/components/LoadingButton";
import { Card } from "@/components/ui/card";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ImageIcon, Loader2, X, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { ClipboardEvent, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSubmitPostMutation } from "./mutations";
import { useUploadThing } from "@/lib/uploadthing";
import "./styles.css";

export interface Attachment {
  file: File;
  previewUrl: string;
  url?: string;
  type?: string;
  isUploading: boolean;
  uploadProgress?: number;
  error?: string;
  uploadId?: string;
}

function EditorHeader({ user }: { user: any }) {
  console.log("🔧 EditorHeader rendering with user:", user?.name);
  return (
    <div className="flex items-start gap-3 mb-4">
      <UserAvatar 
        avatarUrl={user?.image} 
        size="sm"
        className="w-8 h-8 flex-shrink-0 mt-1"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
          {user?.name || 'User'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Share your thoughts...
        </p>
      </div>
    </div>
  );
}

function EditorArea({ editor, isFocused, isOverLimit, onPaste, onDrop, onDragOver, setIsFocused }: {
  editor: any;
  isFocused: boolean;
  isOverLimit: boolean;
  onPaste: (e: ClipboardEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  setIsFocused: (focused: boolean) => void;
}) {
  console.log("🔧 EditorArea rendering - Focused:", isFocused, "OverLimit:", isOverLimit);
  return (
    <div 
      className="flex gap-3"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="flex-1 min-w-0">
        <EditorContent
          editor={editor}
          className={cn(
            "max-h-[15rem] w-full min-w-0 overflow-y-auto rounded-2xl bg-white dark:bg-gray-800/80 px-4 py-3 border-2 transition-all duration-200",
            "focus-within:border-orange-300 focus-within:bg-white dark:focus-within:bg-gray-800",
            !isFocused && "border-gray-200 dark:border-gray-700",
            isOverLimit && "border-red-300 dark:border-red-400"
          )}
          onPaste={onPaste}
          onFocus={() => {
            console.log("🎯 Editor focused");
            setIsFocused(true);
          }}
          onBlur={() => {
            console.log("🎯 Editor blurred");
            setIsFocused(false);
          }}
        />
      </div>
    </div>
  );
}

function CharacterWarning({ isNearLimit, isOverLimit, characterCount }: { 
  isNearLimit: boolean; 
  isOverLimit: boolean;
  characterCount: number;
}) {
  console.log("🔧 CharacterWarning rendering - Count:", characterCount, "NearLimit:", isNearLimit, "OverLimit:", isOverLimit);
  return (
    <AnimatePresence>
      {(isNearLimit || isOverLimit) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            "mt-2 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-2",
            isOverLimit 
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
          )}
        >
          {isOverLimit ? (
            <>
              <AlertCircle className="h-3 w-3" />
              <span>Character limit exceeded! ({characterCount}/10000)</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-3 w-3" />
              <span>Approaching character limit ({characterCount}/10000)</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AttachmentsPreviewSection({ attachments, removeAttachment, retryUpload }: { 
  attachments: Attachment[]; 
  removeAttachment: (fileName: string) => void;
  retryUpload: (fileName: string) => void;
}) {
  console.log("🔧 AttachmentsPreviewSection rendering - Count:", attachments.length);
  return (
    <AnimatePresence>
      {attachments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <AttachmentPreviews
            attachments={attachments}
            removeAttachment={removeAttachment}
            retryUpload={retryUpload}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EditorFooter({ isUploading, attachments, uploadProgress, canSubmit, isOverLimit, onSubmit, handleUploadFiles, mutation }: {
  isUploading: boolean;
  attachments: Attachment[];
  uploadProgress: number;
  canSubmit: boolean;
  isOverLimit: boolean;
  onSubmit: () => void;
  handleUploadFiles: (files: File[]) => void;
  mutation: any;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxAttachments = 5;

  console.log("🔧 EditorFooter rendering - Uploading:", isUploading, "CanSubmit:", canSubmit, "Progress:", uploadProgress);

  return (
    <div className="mt-4 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 order-2 xs:order-1">
        <motion.button
          type="button"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-dashed transition-all duration-200 text-sm font-medium",
            isUploading || attachments.length >= maxAttachments
              ? "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500"
              : "border-orange-300 text-orange-600 hover:border-orange-400 hover:text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:border-orange-500 dark:hover:text-orange-300 dark:hover:bg-orange-900/20"
          )}
          disabled={isUploading || attachments.length >= maxAttachments}
          onClick={() => {
            console.log("📁 Add attachment button clicked");
            fileInputRef.current?.click();
          }}
          whileHover={!(isUploading || attachments.length >= maxAttachments) ? { scale: 1.02 } : {}}
          whileTap={!(isUploading || attachments.length >= maxAttachments) ? { scale: 0.98 } : {}}
        >
          <ImageIcon className="h-4 w-4" />
          <span className="hidden xs:inline">Media</span>
          <span className="text-xs bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-0.5 rounded-full">
            {attachments.length}/{maxAttachments}
          </span>
        </motion.button>

        <input
          type="file"
          accept="image/*,video/*"
          multiple
          ref={fileInputRef}
          className="sr-only hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            console.log("📁 Files selected:", files.map(f => ({ name: f.name, type: f.type, size: f.size })));
            if (files.length) {
              handleUploadFiles(files);
              e.target.value = "";
            }
          }}
        />
        
        {isUploading && (
          <motion.div
            className="flex items-center gap-2 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-1">
              <Loader2 className="size-3 animate-spin text-orange-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {Math.round(uploadProgress)}%
              </span>
            </div>
            <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 order-1 xs:order-2 w-full xs:w-auto">
        <LoadingButton
          onClick={() => {
            console.log("🚀 Submit button clicked");
            onSubmit();
          }}
          loading={mutation.isPending}
          disabled={!canSubmit || isOverLimit}
          className={cn(
            "min-w-20 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
            "transition-all duration-200 text-sm font-medium px-4 py-2 rounded-xl"
          )}
        >
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: canSubmit ? 1.05 : 1 }}
            whileTap={{ scale: canSubmit ? 0.95 : 1 }}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Post</span>
              </>
            )}
          </motion.div>
        </LoadingButton>
      </div>
    </div>
  );
}

export default function PostEditor() {
  console.log("🎬 PostEditor component mounting");
  
  const { user, isLoading } = useSession();
  const mutation = useSubmitPostMutation();
  const { startUpload, isUploading: uploadThingUploading } = useUploadThing("postAttachment");
  const [isFocused, setIsFocused] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [localUploading, setLocalUploading] = useState(false);
  const [fileUploadProgress, setFileUploadProgress] = useState<Record<string, number>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const isUploading = uploadThingUploading || localUploading;

  console.log("🔍 PostEditor state:", {
    user: user?.name,
    isLoading,
    attachmentsCount: attachments.length,
    isUploading,
    isFocused,
    mutationStatus: mutation.status,
    mutationIsPending: mutation.isPending,
    mutationIsError: mutation.isError,
    mutationError: mutation.error
  });

  // Handle loading state
  if (isLoading) {
    console.log("⏳ PostEditor showing loading state");
    return (
      <div className="w-full max-w-full px-2 sm:px-4">
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            <span className="text-sm text-gray-500">Loading editor...</span>
          </div>
        </Card>
      </div>
    );
  }

  // Add null check for user
  if (!user) {
    console.log("🔒 PostEditor showing unauthorized state");
    return (
      <div className="w-full max-w-full px-2 sm:px-4">
        <Card className="p-6 text-center">
          <p className="text-gray-500">Please sign in to create posts</p>
        </Card>
      </div>
    );
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Share your learning journey... ✨",
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[80px] resize-none",
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getText();
      console.log("📝 Editor content updated - Length:", content.length);
    },
  });

  // FIX: Define input variable here, not inside functions
  const input = editor?.getText({ blockSeparator: "\n" }) || "";

  const handleUploadFiles = async (files: File[]) => {
    console.log("🔄 handleUploadFiles called with files:", files.map(f => ({ name: f.name, type: f.type, size: f.size })));
    
    const maxAttachments = 5;
    const remainingSlots = maxAttachments - attachments.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      console.log("❌ No available slots for new attachments");
      return;
    }

    console.log("📤 Files to upload:", filesToUpload.map(f => f.name));

    // Initialize progress tracking and clear any previous errors
    const initialProgress: Record<string, number> = {};
    const clearedErrors: Record<string, string> = {};
    filesToUpload.forEach(file => {
      initialProgress[file.name] = 0;
      clearedErrors[file.name] = "";
    });
    setFileUploadProgress(prev => ({ ...prev, ...initialProgress }));
    setUploadErrors(prev => ({ ...prev, ...clearedErrors }));

    const newAttachments: Attachment[] = filesToUpload.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      isUploading: true,
      uploadProgress: 0,
      uploadId: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));

    console.log("📝 Setting new attachments");
    setAttachments(prev => [...prev, ...newAttachments]);
    setLocalUploading(true);

    // Progress simulation interval
    let progressInterval: NodeJS.Timeout | null = null;

    try {
      console.log("🚀 Starting UploadThing upload process...");

      // Start progress simulation
      progressInterval = setInterval(() => {
        setFileUploadProgress(prev => {
          const updated = { ...prev };
          let anyProgress = false;
          
          filesToUpload.forEach(file => {
            if (updated[file.name] < 80) { // Stop at 80% to wait for actual completion
              updated[file.name] = Math.min(updated[file.name] + 5, 80);
              anyProgress = true;
            }
          });

          if (anyProgress) {
            // Update attachments with progress
            setAttachments(prevAttachments => prevAttachments.map(att => {
              if (filesToUpload.some(f => f.name === att.file.name)) {
                return {
                  ...att,
                  uploadProgress: updated[att.file.name] || 0
                };
              }
              return att;
            }));
          }

          return updated;
        });
      }, 300);

      console.log("📤 Calling UploadThing startUpload...");
      const results = await startUpload(filesToUpload);
      
      // Clear progress simulation
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }

      console.log("✅ UploadThing RAW response:", results);
      console.log("🔍 UploadThing response type:", typeof results);
      console.log("🔍 UploadThing response length:", Array.isArray(results) ? results.length : 'not array');

      // FIXED: Handle different UploadThing response formats
      if (results) {
        const resultArray = Array.isArray(results) ? results : [results];
        
        console.log("🔍 Processing results array:", resultArray);
        
        if (resultArray.length > 0) {
          console.log("🎉 Upload successful for files:", resultArray.map(r => r.name || 'unnamed'));
          
          // Set progress to 100% for successful uploads
          setFileUploadProgress(prev => {
            const updated = { ...prev };
            resultArray.forEach(result => {
              const fileName = result.name || filesToUpload.find(f => f.size === result.size)?.name;
              if (fileName) {
                updated[fileName] = 100;
              }
            });
            return updated;
          });

          // Update attachments with the uploaded URLs
          setAttachments(prev => prev.map((att) => {
            // Try multiple ways to match the result with our file
            const result = resultArray.find(r => 
              r.name === att.file.name || 
              r.key === att.file.name ||
              (r.size && r.size === att.file.size)
            );

            if (result) {
              console.log(`✅ File uploaded successfully: ${att.file.name}`, result);
              
              // FIXED: Extract URL from different possible response formats
              const fileUrl = result.url || result.fileUrl || result.data?.url;
              
              if (!fileUrl) {
                console.log(`❌ No URL found in result for: ${att.file.name}`, result);
                return {
                  ...att,
                  isUploading: false,
                  uploadProgress: -1,
                  error: "Upload completed but no URL returned"
                };
              }

              return {
                ...att,
                url: fileUrl,
                type: result.type || (att.file.type.startsWith('image/') ? 'image' : 'video'),
                isUploading: false,
                uploadProgress: 100,
                error: undefined
              };
            }
            
            // If no result for this file, mark as failed
            console.log(`❌ No result found for file: ${att.file.name}`);
            return {
              ...att,
              isUploading: false,
              uploadProgress: -1,
              error: "Upload completed but file not found in response"
            };
          }));

          // Clear errors for successful uploads
          setUploadErrors(prev => {
            const updated = { ...prev };
            resultArray.forEach(result => {
              const fileName = result.name || filesToUpload.find(f => f.size === result.size)?.name;
              if (fileName) {
                delete updated[fileName];
              }
            });
            return updated;
          });

        } else {
          console.error("❌ UploadThing returned empty results array");
          throw new Error("Upload failed - no results returned from UploadThing");
        }
      } else {
        console.error("❌ UploadThing returned null/undefined results");
        throw new Error("Upload failed - null response from UploadThing");
      }

    } catch (error) {
      console.error("💥 Upload process failed:", error);
      
      // Clear progress simulation if still running
      if (progressInterval) {
        clearInterval(progressInterval);
      }

      // Set errors for all files
      const errorMessage = error instanceof Error ? error.message : "Unknown upload error";
      const newErrors: Record<string, string> = {};
      filesToUpload.forEach(file => {
        newErrors[file.name] = errorMessage;
      });
      setUploadErrors(prev => ({ ...prev, ...newErrors }));

      // Mark all files as failed
      setFileUploadProgress(prev => {
        const updated = { ...prev };
        filesToUpload.forEach(file => {
          updated[file.name] = -1;
        });
        return updated;
      });

      setAttachments(prev => prev.map(att => {
        if (filesToUpload.some(f => f.name === att.file.name)) {
          return {
            ...att,
            isUploading: false,
            uploadProgress: -1,
            error: errorMessage
          };
        }
        return att;
      }));

    } finally {
      console.log("🏁 Upload process completed");
      setLocalUploading(false);
    }
  };

  const retryUpload = (fileName: string) => {
    console.log("🔄 Retrying upload for file:", fileName);
    const attachmentToRetry = attachments.find(att => att.file.name === fileName);
    if (attachmentToRetry) {
      // Remove the failed attachment first
      setAttachments(prev => prev.filter(att => att.file.name !== fileName));
      // Clear any error for this file
      setUploadErrors(prev => {
        const updated = { ...prev };
        delete updated[fileName];
        return updated;
      });
      // Retry the upload
      setTimeout(() => {
        handleUploadFiles([attachmentToRetry.file]);
      }, 100);
    }
  };

  function onPaste(e: ClipboardEvent) {
    const files = Array.from(e.clipboardData.files);
    console.log("📋 Files pasted:", files.map(f => f.name));
    if (files.length > 0) {
      handleUploadFiles(files);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    console.log("📂 Files dropped:", files.map(f => f.name));
    if (files.length > 0) {
      handleUploadFiles(files);
    }
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  const revokeAllPreviewUrls = () => {
    console.log("🧹 Revoking all preview URLs");
    attachments.forEach(att => {
      if (att.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(att.previewUrl);
      }
    });
  };

  function onSubmit() {
    console.log("🚀 onSubmit called - Mutation state:", {
      isPending: mutation.isPending,
      isError: mutation.isError,
      error: mutation.error
    });
    
    // FIX: Use the input variable defined at component level
    if (!input.trim()) {
      console.log("❌ Submit failed: Empty content");
      return;
    }

    const hasUploadingAttachments = attachments.some(att => att.isUploading);
    
    if (hasUploadingAttachments) {
      console.log("❌ Submit failed: Uploads still in progress");
      return;
    }

    const hasFailedUploads = attachments.some(att => att.uploadProgress === -1);
    if (hasFailedUploads) {
      console.log("❌ Submit failed: Some uploads failed");
      return;
    }

    const uploadedMediaUrls = attachments
      .filter(att => att.url && !att.isUploading && att.uploadProgress === 100)
      .map(att => ({
        url: att.url!,
        type: att.type || 'image'
      }));

    console.log('🔍 Submitting post with data:', {
      contentLength: input.length,
      mediaUrls: uploadedMediaUrls,
      attachmentCount: attachments.length,
      successfulAttachments: uploadedMediaUrls.length
    });

    // Reset mutation state if it was in error state
    if (mutation.isError) {
      console.log("🔄 Resetting mutation error state");
      mutation.reset();
    }

    mutation.mutate(
      {
        content: input,
        mediaUrls: uploadedMediaUrls.length > 0 ? uploadedMediaUrls : undefined,
      },
      {
        onSuccess: (result) => {
          console.log('🎉 Post created successfully:', result);
          editor?.commands.clearContent();
          revokeAllPreviewUrls();
          setAttachments([]);
          setLocalUploading(false);
          setIsFocused(false);
          setFileUploadProgress({});
          setUploadErrors({});
          
          // Force a small delay to ensure state is cleared
          setTimeout(() => {
            console.log("✅ Post submission completed and state reset");
          }, 100);
        },
        onError: (error) => {
          console.error('💥 Failed to create post:', error);
          console.error('💥 Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
          });
        },
        onSettled: () => {
          console.log('🏁 Mutation settled - Status:', mutation.status);
        },
      },
    );
  }

  const removeAttachment = (fileName: string) => {
    console.log("🗑️ Removing attachment:", fileName);
    setAttachments(prev => {
      const attachmentToRemove = prev.find(a => a.file.name === fileName);
      if (attachmentToRemove?.previewUrl) {
        URL.revokeObjectURL(attachmentToRemove.previewUrl);
      }
      return prev.filter((a) => a.file.name !== fileName);
    });
    // Clear progress and error tracking
    setFileUploadProgress(prev => {
      const updated = { ...prev };
      delete updated[fileName];
      return updated;
    });
    setUploadErrors(prev => {
      const updated = { ...prev };
      delete updated[fileName];
      return updated;
    });
  };

  // FIX: Use the input variable defined at component level
  const canSubmit = input.trim().length > 0 && 
                   !isUploading && 
                   attachments.every(att => !att.isUploading) &&
                   attachments.every(att => att.uploadProgress !== -1) &&
                   !mutation.isPending;

  const characterCount = input.length;
  const isNearLimit = characterCount > 9000;
  const isOverLimit = characterCount > 10000;

  const uploadProgress = attachments.length > 0 
    ? attachments.reduce((sum, att) => sum + (att.uploadProgress || 0), 0) / attachments.length
    : 0;

  // Debug mutation state changes
  useEffect(() => {
    console.log("🔄 Mutation state changed:", {
      status: mutation.status,
      isPending: mutation.isPending,
      isError: mutation.isError,
      error: mutation.error,
      isSuccess: mutation.isSuccess
    });
  }, [mutation.status, mutation.isPending, mutation.isError, mutation.error, mutation.isSuccess]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      console.log("🧹 PostEditor unmounting - cleaning up preview URLs");
      attachments.forEach(att => {
        if (att.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(att.previewUrl);
        }
      });
    };
  }, [attachments]);

  console.log("🎯 PostEditor render completed - State:", {
    canSubmit,
    characterCount,
    isUploading,
    mutationState: {
      isPending: mutation.isPending,
      isError: mutation.isError,
      error: mutation.error
    },
    attachments: attachments.map(a => ({ 
      name: a.file.name, 
      progress: a.uploadProgress, 
      uploading: a.isUploading,
      error: a.error 
    }))
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-full px-2 sm:px-4"
    >
      <Card className={cn(
        "p-4 sm:p-6 glass-strong transition-all duration-300 w-full max-w-full border-0 shadow-lg",
        isFocused && "ring-2 ring-orange-500/50 shadow-xl",
        mutation.isError && "ring-2 ring-red-500/50"
      )}>
        {/* Mutation Error Banner */}
        <AnimatePresence>
          {mutation.isError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg"
            >
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Failed to create post</span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                {mutation.error?.message || "An unexpected error occurred"}
              </p>
              <button
                onClick={() => mutation.reset()}
                className="text-xs text-red-500 hover:text-red-700 mt-2"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <EditorHeader user={user} />
        <EditorArea 
          editor={editor}
          isFocused={isFocused}
          isOverLimit={isOverLimit}
          onPaste={onPaste}
          onDrop={onDrop}
          onDragOver={onDragOver}
          setIsFocused={setIsFocused}
        />
        <CharacterWarning 
          isNearLimit={isNearLimit} 
          isOverLimit={isOverLimit}
          characterCount={characterCount}
        />
        <AttachmentsPreviewSection 
          attachments={attachments} 
          removeAttachment={removeAttachment}
          retryUpload={retryUpload}
        />
        <EditorFooter 
          isUploading={isUploading}
          attachments={attachments}
          uploadProgress={uploadProgress}
          canSubmit={canSubmit}
          isOverLimit={isOverLimit}
          onSubmit={onSubmit}
          handleUploadFiles={handleUploadFiles}
          mutation={mutation}
        />

        {/* Debug Info Panel */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg border">
            <div className="text-xs font-mono">
              <div className="font-semibold mb-2">Debug Info:</div>
              <div>Mutation: {mutation.status} {mutation.isPending ? "⏳" : mutation.isError ? "❌" : mutation.isSuccess ? "✅" : "⚪"}</div>
              <div>Attachments: {attachments.length} ({attachments.filter(a => a.uploadProgress === 100).length} ready)</div>
              <div>Content: {input.length} chars</div>
              <div>Can Submit: {canSubmit ? "✅" : "❌"}</div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void;
  retryUpload: (fileName: string) => void;
}

function AttachmentPreviews({
  attachments,
  removeAttachment,
  retryUpload,
}: AttachmentPreviewsProps) {
  console.log("🔧 AttachmentPreviews rendering with", attachments.length, "attachments");
  
  return (
    <div
      className={cn(
        "grid gap-3",
        attachments.length === 1 ? "grid-cols-1" :
        attachments.length === 2 ? "grid-cols-2" :
        attachments.length >= 3 ? "grid-cols-2 sm:grid-cols-3" : ""
      )}
    >
      {attachments.map((attachment, index) => (
        <motion.div
          key={attachment.uploadId || attachment.file.name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: index * 0.1 }}
          className="w-full"
        >
          <AttachmentPreview
            attachment={attachment}
            onRemoveClick={() => removeAttachment(attachment.file.name)}
            onRetry={() => retryUpload(attachment.file.name)}
          />
        </motion.div>
      ))}
    </div>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
  onRetry: () => void;
}

function AttachmentPreview({
  attachment: { file, previewUrl, url, isUploading, uploadProgress, error },
  onRemoveClick,
  onRetry,
}: AttachmentPreviewProps) {
  console.log(`🔧 AttachmentPreview rendering: ${file.name}`, { 
    isUploading, 
    uploadProgress, 
    hasError: !!error,
    hasUrl: !!url 
  });

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        console.log(`🧹 Cleaning up preview URL for: ${file.name}`);
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, file.name]);

  const mediaSrc = url || previewUrl;
  const isFailed = uploadProgress === -1;
  const isComplete = uploadProgress === 100 && url;

  const handleContainerClick = () => {
    if (isFailed) {
      console.log(`🔄 Retrying failed upload: ${file.name}`);
      onRetry();
    }
  };

  return (
    <div 
      className={cn(
        "relative group w-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 cursor-default",
        isUploading && "opacity-80",
        isFailed && "border-2 border-red-500 cursor-pointer",
        isComplete && "border-2 border-green-500"
      )}
      onClick={handleContainerClick}
    >
      <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 w-full aspect-square">
        {file.type.startsWith("image") ? (
          <img
            src={mediaSrc}
            alt="Attachment preview"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <video controls className="w-full h-full object-cover">
              <source src={mediaSrc} type={file.type} />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        
        {(isUploading || isFailed) && (
          <div className={cn(
            "absolute inset-0 flex items-center justify-center",
            isFailed ? "bg-red-500/80" : "bg-black/60"
          )}>
            <div className="text-white text-center p-3">
              {isFailed ? (
                <>
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-sm font-medium">Upload Failed</div>
                  <div className="text-xs mt-1 max-w-[120px] truncate">{error || "Unknown error"}</div>
                  <div className="text-xs mt-2">Click to retry</div>
                </>
              ) : (
                <>
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <div className="text-sm font-medium">
                    {uploadProgress === 100 ? 'Processing...' : `${Math.round(uploadProgress || 0)}%`}
                  </div>
                  <div className="w-20 h-1 bg-white/30 rounded-full overflow-hidden mt-1">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        uploadProgress === 100 ? "bg-blue-500" : "bg-orange-500"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {isComplete && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
        )}
      </div>
      
      <motion.button
        className={cn(
          "absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg z-10",
          isFailed ? "bg-gray-500 text-white hover:bg-gray-600" : "bg-red-500 text-white hover:bg-red-600"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onRemoveClick();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="h-3 w-3" />
      </motion.button>

      {isComplete && (
        <motion.div
          className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <CheckCircle2 className="h-3 w-3" />
          <span>Ready</span>
        </motion.div>
      )}

      {/* File name overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <p className="text-xs text-white truncate" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-white/70">
          {isUploading ? `Uploading... ${uploadProgress}%` : 
           isFailed ? "Failed - Click to retry" :
           isComplete ? "Ready to post" : 
           "Processing..."}
        </p>
      </div>
    </div>
  );
}