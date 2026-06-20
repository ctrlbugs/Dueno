const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_IMAGES = 12;
const MAX_DIMENSION = 1400;
const JPEG_QUALITY = 0.82;
const WATERMARK_OPACITY = 0.5;
const WATERMARK_MAX_WIDTH_RATIO = 0.18;
const WATERMARK_SRC = `${import.meta.env.BASE_URL}assets/img/logo-white.svg`;

export type ListingImageFile = {
  id: string;
  name: string;
  dataUrl: string;
};

export const LISTING_IMAGE_LIMITS = {
  maxImages: MAX_IMAGES,
  maxFileBytes: MAX_FILE_BYTES,
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Invalid image file."));
    img.src = src;
  });

let watermarkImagePromise: Promise<HTMLImageElement> | null = null;

const loadWatermarkImage = (): Promise<HTMLImageElement> => {
  if (!watermarkImagePromise) {
    watermarkImagePromise = loadImage(WATERMARK_SRC);
  }
  return watermarkImagePromise;
};

const drawDuenoWatermark = async (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  try {
    const logo = await loadWatermarkImage();
    const maxWidth = width * WATERMARK_MAX_WIDTH_RATIO;
    const scale = maxWidth / logo.width;
    const logoWidth = logo.width * scale;
    const logoHeight = logo.height * scale;
    const x = (width - logoWidth) / 2;
    const y = (height - logoHeight) / 2;

    ctx.save();
    ctx.globalAlpha = WATERMARK_OPACITY;
    ctx.drawImage(logo, x, y, logoWidth, logoHeight);
    ctx.restore();
  } catch {
    // Listing upload should still succeed if the watermark asset fails to load.
  }
};

const compressDataUrl = async (dataUrl: string): Promise<string> => {
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;

  ctx.drawImage(img, 0, 0, width, height);
  await drawDuenoWatermark(ctx, width, height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
};

export const processListingImageFiles = async (
  files: FileList | File[],
  existingCount: number
): Promise<{ images: ListingImageFile[]; errors: string[] }> => {
  const fileArray = Array.from(files).filter((file) =>
    file.type.startsWith("image/")
  );
  const images: ListingImageFile[] = [];
  const errors: string[] = [];

  if (fileArray.length === 0) {
    errors.push("Please choose image files (JPG, PNG, or WebP).");
    return { images, errors };
  }

  const remaining = MAX_IMAGES - existingCount;
  if (remaining <= 0) {
    errors.push(`You can upload up to ${MAX_IMAGES} photos per listing.`);
    return { images, errors };
  }

  const selected = fileArray.slice(0, remaining);
  if (fileArray.length > remaining) {
    errors.push(`Only ${remaining} more photo(s) can be added.`);
  }

  for (const file of selected) {
    if (file.size > MAX_FILE_BYTES) {
      errors.push(`${file.name} is too large (max 8 MB).`);
      continue;
    }

    try {
      const raw = await readFileAsDataUrl(file);
      const dataUrl = await compressDataUrl(raw);
      images.push({
        id: `img-${crypto.randomUUID()}`,
        name: file.name,
        dataUrl,
      });
    } catch {
      errors.push(`${file.name} could not be processed.`);
    }
  }

  return { images, errors };
};
