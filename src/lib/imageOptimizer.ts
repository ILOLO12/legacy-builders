const DEFAULT_MAX_DIMENSION = 2000;
const DEFAULT_TARGET_BYTES = 2 * 1024 * 1024; // 2 MB soft target
const DEFAULT_HARD_MAX_BYTES = 5 * 1024 * 1024; // 5 MB hard limit
const DEFAULT_VIDEO_MAX_BYTES = 50 * 1024 * 1024; // 50 MB, no compression applied

const QUALITY_STEPS = [0.85, 0.75, 0.65, 0.55, 0.45];

// Formats that shouldn't be re-encoded (animation or already-vector).
const SKIP_REENCODE = ["image/gif", "image/svg+xml"];

interface OptimizeOptions {
  maxDimension?: number;
  targetBytes?: number;
  hardMaxBytes?: number;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Impossible de lire l'image")); };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

function withExtension(filename: string, ext: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  return `${base}.${ext}`;
}

/**
 * Resizes, compresses and re-encodes an image to WebP client-side before upload.
 * Non-image files (or GIF/SVG) pass through with only a hard size-limit check.
 */
export async function optimizeImage(file: File, opts: OptimizeOptions = {}): Promise<File> {
  const maxDimension = opts.maxDimension ?? DEFAULT_MAX_DIMENSION;
  const targetBytes = opts.targetBytes ?? DEFAULT_TARGET_BYTES;
  const hardMaxBytes = opts.hardMaxBytes ?? DEFAULT_HARD_MAX_BYTES;

  if (!file.type.startsWith("image/") || SKIP_REENCODE.includes(file.type)) {
    if (file.size > hardMaxBytes) {
      throw new Error(`Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo, limite ${(hardMaxBytes / 1024 / 1024).toFixed(0)} Mo).`);
    }
    return file;
  }

  const img = await loadImage(file);
  let { width, height } = img;
  if (Math.max(width, height) > maxDimension) {
    const scale = maxDimension / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, width, height);

  let best: Blob | null = null;
  for (const quality of QUALITY_STEPS) {
    const blob = await canvasToBlob(canvas, "image/webp", quality);
    if (!blob) continue;
    best = blob;
    if (blob.size <= targetBytes) break;
  }

  if (!best) return file;
  if (best.size > hardMaxBytes) {
    throw new Error(`L'image reste trop volumineuse après compression (${(best.size / 1024 / 1024).toFixed(1)} Mo, limite ${(hardMaxBytes / 1024 / 1024).toFixed(0)} Mo). Essayez une image plus petite.`);
  }

  return new File([best], withExtension(file.name, "webp"), { type: "image/webp" });
}

/** For non-image uploads (video, PDF): validate size only, no transformation. */
export function validateFileSize(file: File, maxBytes: number = DEFAULT_VIDEO_MAX_BYTES): void {
  if (file.size > maxBytes) {
    throw new Error(`Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo, limite ${(maxBytes / 1024 / 1024).toFixed(0)} Mo).`);
  }
}
