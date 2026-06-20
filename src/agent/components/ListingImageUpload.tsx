import { useRef, useState } from "react";
import type { ListingImageFile } from "../utils/listingImages";
import {
  LISTING_IMAGE_LIMITS,
  processListingImageFiles,
} from "../utils/listingImages";

type ListingImageUploadProps = {
  images: ListingImageFile[];
  onChange: (images: ListingImageFile[]) => void;
  coverImageId?: string;
  onCoverChange?: (id: string) => void;
};

const ListingImageUpload = ({
  images,
  onChange,
  coverImageId,
  onCoverChange,
}: ListingImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setUploadError(null);
    setProcessing(true);

    const { images: added, errors } = await processListingImageFiles(
      fileList,
      images.length
    );

    setProcessing(false);
    if (added.length) {
      onChange([...images, ...added]);
    }
    if (errors.length) {
      setUploadError(errors.join(" "));
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeImage = (id: string) => {
    onChange(images.filter((image) => image.id !== id));
  };

  const setCover = (id: string) => {
    if (onCoverChange) {
      onCoverChange(id);
      return;
    }
    const selected = images.find((image) => image.id === id);
    if (!selected) return;
    onChange([
      selected,
      ...images.filter((image) => image.id !== id),
    ]);
  };

  const activeCoverId = coverImageId ?? images[0]?.id;

  return (
    <div className="mb-4">
      <label className="form-label d-flex align-items-center justify-content-between">
        <span>
          Property photos<span className="text-danger ms-1">*</span>
        </span>
        <small className="text-muted fw-normal">
          {images.length}/{LISTING_IMAGE_LIMITS.maxImages}
        </small>
      </label>
      <p className="text-muted fs-13 mb-3">
        Upload clear exterior and interior shots. Each photo is stamped with the
        Dueno watermark. The first photo is used as the cover image.
      </p>

      {uploadError && (
        <div className="alert alert-warning py-2 fs-13">{uploadError}</div>
      )}

      <div
        className="listing-upload-dropzone border rounded-3 p-4 text-center mb-3"
        onDragOver={(event) => {
          event.preventDefault();
          event.currentTarget.classList.add("border-primary");
        }}
        onDragLeave={(event) => {
          event.currentTarget.classList.remove("border-primary");
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.currentTarget.classList.remove("border-primary");
          void handleFiles(event.dataTransfer.files);
        }}
      >
        <i className="material-icons-outlined fs-2 text-primary mb-2">
          cloud_upload
        </i>
        <p className="mb-2 fw-medium">Drag & drop photos here</p>
        <p className="text-muted fs-13 mb-3">JPG, PNG, or WebP — up to 8 MB each</p>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          disabled={
            processing || images.length >= LISTING_IMAGE_LIMITS.maxImages
          }
          onClick={() => inputRef.current?.click()}
        >
          {processing ? "Processing..." : "Browse Photos"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          multiple
          hidden
          onChange={(event) => void handleFiles(event.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="row g-3">
          {images.map((image) => (
            <div className="col-6 col-md-4 col-lg-3" key={image.id}>
              <div className="listing-upload-thumb position-relative border rounded-3 overflow-hidden">
                <img
                  src={image.dataUrl}
                  alt={image.name}
                  className="w-100 object-fit-cover"
                  style={{ height: 120 }}
                />
                {image.id === activeCoverId && (
                  <span className="badge bg-primary position-absolute top-0 start-0 m-2">
                    Cover
                  </span>
                )}
                <div className="listing-upload-actions d-flex gap-1 p-2">
                  {image.id !== activeCoverId && (
                    <button
                      type="button"
                      className="btn btn-light btn-sm flex-fill"
                      onClick={() => setCover(image.id)}
                    >
                      Set cover
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    aria-label={`Remove ${image.name}`}
                    onClick={() => removeImage(image.id)}
                  >
                    <i className="material-icons-outlined fs-6">close</i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingImageUpload;
