const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_IMAGES = 12;
const MAX_DIMENSION = 1400;
const JPEG_QUALITY = 0.82;

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
