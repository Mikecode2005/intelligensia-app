// components/PostEditor.tsx
"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { Card } from "@/components/ui/card";
import UserAvatar from "@/components/UserAvatar";
import { useSubmitPostMutation } from "./mutations";
import { useUploadThing } from "@/lib/uploadthing";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, CheckCircle2, X } from "lucide-react";

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

export default function PostEditor() {
  const { user, isLoading } = useSession();
  const mutation = useSubmitPostMutation();
  const { startUpload, isUploading: uploadThingUploading } = useUploadThing("postAttachment");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-1">
          <div className="w-11 h-11 bg-[#262626] rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#262626] rounded w-32 animate-pulse" />
            <div className="h-10 bg-[#262626] rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const handleUploadFiles = async (files: File[]) => {
    const maxAttachments = 5;
    const remainingSlots = maxAttachments - attachments.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (filesToUpload.length === 0) return;

    const newAttachments: Attachment[] = filesToUpload.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      isUploading: true,
      uploadProgress: 0,
      uploadId: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
    setIsUploading(true);

    try {
      const results = await startUpload(filesToUpload);

      if (results) {
        const resultArray = Array.isArray(results) ? results : [results];

        setAttachments(prev => prev.map((att) => {
          const result = resultArray.find(r => 
            r.name === att.file.name || 
            (r.size && r.size === att.file.size)
          );

          if (result) {
            const fileUrl = result.url || result.fileUrl || result.data?.url;
            return {
              ...att,
              url: fileUrl,
              type: result.type || (att.file.type.startsWith('image/') ? 'image' : 'video'),
              isUploading: false,
              uploadProgress: 100,
              error: undefined
            };
          }
          
          return att;
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
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
      setIsUploading(false);
    }
  };

  const removeAttachment = (fileName: string) => {
    setAttachments(prev => {
      const attachmentToRemove = prev.find(a => a.file.name === fileName);
      if (attachmentToRemove?.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(attachmentToRemove.previewUrl);
      }
      return prev.filter((a) => a.file.name !== fileName);
    });
  };

  const retryUpload = (fileName: string) => {
    const attachmentToRetry = attachments.find(att => att.file.name === fileName);
    if (attachmentToRetry) {
      setAttachments(prev => prev.filter(att => att.file.name !== fileName));
      setTimeout(() => {
        handleUploadFiles([attachmentToRetry.file]);
      }, 100);
    }
  };

  const canSubmit = content.trim().length > 0 && 
                    !isUploading && 
                    attachments.every(att => !att.isUploading) &&
                    !mutation.isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const uploadedMediaUrls = attachments
      .filter(att => att.url && !att.isUploading && att.uploadProgress === 100)
      .map(att => ({
        url: att.url!,
        type: att.type || 'image'
      }));

    mutation.mutate(
      {
        content: content,
        mediaUrls: uploadedMediaUrls.length > 0 ? uploadedMediaUrls : undefined,
      },
      {
        onSuccess: () => {
          setContent("");
          setAttachments([]);
          attachments.forEach(att => {
            if (att.previewUrl.startsWith('blob:')) {
              URL.revokeObjectURL(att.previewUrl);
            }
          });
        },
      },
    );
  };

  return (
    <div className="w-full">
      <div className="flex gap-4">
        <UserAvatar
          avatarUrl={user.image || null}
          size={44}
          className="rounded-full shrink-0"
        />
        <div className="flex-1 flex flex-col gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an insight, question, or research paper..."
            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-neutral-600 resize-none text-base min-h-[70px]"
          />

          {/* Attachments Preview */}
          <AnimatePresence>
            {attachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-3"
              >
                {attachments.map((att) => (
                  <AttachmentPreview
                    key={att.uploadId}
                    attachment={att}
                    onRemove={() => removeAttachment(att.file.name)}
                    onRetry={() => retryUpload(att.file.name)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#262626]">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || attachments.length >= 5}
                className="p-2 text-neutral-500 hover:text-[#FF6B00] hover:bg-white/5 rounded-lg transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[22px]">image</span>
              </button>
              <button
                type="button"
                className="p-2 text-neutral-500 hover:text-[#FF6B00] hover:bg-white/5 rounded-lg transition-all"
              >
                <span className="material-symbols-outlined text-[22px]">attachment</span>
              </button>
              <button
                type="button"
                className="p-2 text-neutral-500 hover:text-[#FF6B00] hover:bg-white/5 rounded-lg transition-all"
              >
                <span className="material-symbols-outlined text-[22px]">link</span>
              </button>
              <button
                type="button"
                className="p-2 text-neutral-500 hover:text-[#FF6B00] hover:bg-white/5 rounded-lg transition-all"
              >
                <span className="material-symbols-outlined text-[22px]">tag</span>
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="bg-[#FF6B00] text-black px-8 py-2 rounded-lg text-sm font-bold hover:bg-[#E66000] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {mutation.isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500">
                  {mutation.error?.message || "Failed to create post"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            handleUploadFiles(files);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemove: () => void;
  onRetry: () => void;
}

function AttachmentPreview({
  attachment,
  onRemove,
  onRetry,
}: AttachmentPreviewProps) {
  const isFailed = attachment.uploadProgress === -1;
  const isComplete = attachment.uploadProgress === 100 && attachment.url;

  return (
    <div
      className="relative rounded-lg overflow-hidden bg-black/40 group cursor-default"
      onClick={() => isFailed && onRetry()}
    >
      <div className="aspect-square bg-[#262626]">
        {attachment.file.type.startsWith("image") ? (
          <img
            src={attachment.previewUrl}
            alt="preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={attachment.previewUrl}
            className="w-full h-full object-cover"
          />
        )}

        {(attachment.isUploading || isFailed) && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center ${
            isFailed ? "bg-red-500/80" : "bg-black/60"
          }`}>
            {isFailed ? (
              <>
                <AlertCircle className="h-6 w-6 text-white mb-1" />
                <span className="text-xs text-white font-medium">Failed</span>
              </>
            ) : (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-white mb-1" />
                <span className="text-xs text-white font-medium">
                  {Math.round(attachment.uploadProgress || 0)}%
                </span>
              </>
            )}
          </div>
        )}

        {isComplete && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="h-3 w-3" />
      </motion.button>
    </div>
  );
}
