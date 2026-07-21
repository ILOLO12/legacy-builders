import { supabase } from "@/integrations/supabase/client";
import { optimizeImage, validateFileSize } from "@/lib/imageOptimizer";

const BUCKET = "media";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function sanitizeExt(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "";
  return ext || "bin";
}

/** Uploads via XHR (not the JS SDK) purely to get real upload-progress events. */
function uploadWithProgress(path: string, file: File, token: string, onProgress?: (percent: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("apikey", SUPABASE_ANON_KEY);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.setRequestHeader("cache-control", "3600");
    xhr.setRequestHeader("x-upsert", "false");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Échec du téléversement (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Échec du téléversement (réseau)"));
    xhr.send(file);
  });
}

export interface UploadOptions {
  onProgress?: (percent: number) => void;
  /** For non-image files (video, PDF): max size in bytes. Default 50 MB. */
  maxFileBytes?: number;
}

export async function uploadMedia(file: File, opts: UploadOptions = {}): Promise<string> {
  let toUpload = file;
  if (file.type.startsWith("image/")) {
    toUpload = await optimizeImage(file);
  } else {
    validateFileSize(file, opts.maxFileBytes);
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token ?? SUPABASE_ANON_KEY;

  const path = `${crypto.randomUUID()}.${sanitizeExt(toUpload.name)}`;
  await uploadWithProgress(path, toUpload, token, opts.onProgress);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteMedia(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

export async function listMedia() {
  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) throw error;
  return data;
}

export function mediaPublicUrl(path: string): string {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
