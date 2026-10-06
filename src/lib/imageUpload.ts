/**
 * The one rule for photos a host uploads (invite card sources, the RSVP
 * illustration source, the profile photo). The AI generator can't read HEIC
 * and skips sources over 20 MB, and a browser can't open HEIC in the cropper
 * either, so those are stopped before anything is uploaded.
 *
 * Import-free on purpose, like lib/sse.ts, so it can be checked on its own.
 */
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** For a file input's `accept`, so the picker only offers what the check allows. */
export const IMAGE_ACCEPT = ACCEPTED_IMAGE_TYPES.join(",");

export const MAX_IMAGE_UPLOAD_BYTES = 20 * 1024 * 1024;

/** Why this file can't be uploaded, as a message for the user; null when it can. */
export const imageUploadProblem = (file: {
  type: string;
  size: number;
}): string | null => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Upload a JPG, PNG or WebP image.";
  }

  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return "Images must be 20 MB or smaller.";
  }

  return null;
};
