// utils/upload-utils.ts
export async function uploadFileDirect(file: File, slug: string, timeoutMs = 30000) {
  const formData = new FormData();
  formData.append("files", file);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.log(`📤 Uploading file to ${slug}:`, {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    const response = await fetch(`/api/uploadthing?slug=${slug}`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Upload successful for ${slug}:`, data);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error(`Upload timed out after ${timeoutMs}ms`);
    }
    
    console.error(`❌ Upload failed for ${slug}:`, error);
    throw error;
  }
}