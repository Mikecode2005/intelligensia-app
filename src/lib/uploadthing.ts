import { useState, useCallback } from "react";

type UploadCallbacks = {
  onBeforeUploadBegin?: (files: File[]) => File[] | Promise<File[]>;
  onUploadProgress?: (percent: number) => void;
  onClientUploadComplete?: (res: any[]) => void;
  onUploadError?: (e: any) => void;
};

async function uploadFilesToServer(files: File[], slug: string, onProgress?: (p: number) => void) {
  return new Promise<any[]>((resolve, reject) => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));

    const xhr = new XMLHttpRequest();
    const url = `/api/uploadthing?slug=${encodeURIComponent(slug)}`;

    xhr.open("POST", url);

    xhr.upload.onprogress = (ev) => {
      if (!ev.lengthComputable) return;
      const percent = Math.round((ev.loaded / ev.total) * 100);
      onProgress?.(percent);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch (e) {
          reject(e);
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(form);
  });
}

export function useUploadThing(slug: string, callbacks: UploadCallbacks = {}) {
  const [isUploading, setIsUploading] = useState(false);

  const startUpload = useCallback(
    async (incomingFiles: File[]) => {
      if (isUploading) return;
      setIsUploading(true);

      try {
        const beforeFn = (callbacks.onBeforeUploadBegin ?? (callbacks as any).onUploadBegin) as
          | ((files: File[]) => File[] | Promise<File[]>)
          | undefined;

        const files = (await beforeFn?.(incomingFiles)) ?? incomingFiles;

        const onProgress = (callbacks.onUploadProgress ?? (callbacks as any).onProgress) as (
          p: number
        ) => void | undefined;

        const res = await uploadFilesToServer(files, slug, (p) => onProgress?.(p));

        const completeFn = (callbacks.onClientUploadComplete ?? (callbacks as any).onComplete) as
          | ((res: any[]) => void)
          | undefined;

        completeFn?.(res ?? []);
        return res;
      } catch (e) {
        (callbacks.onUploadError ?? (callbacks as any).onError)?.(e);
        throw e;
      } finally {
        setIsUploading(false);
      }
    },
    [slug, callbacks, isUploading]
  );

  return { startUpload, isUploading };
}

export async function uploadFiles(files: File[], slug: string, onProgress?: (p: number) => void) {
  return uploadFilesToServer(files, slug, onProgress);
}
