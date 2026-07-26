export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<{ url: string; blob: Blob } | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  // Calculate bounding box of the rotated image
  const safeArea = Math.max(image.width, image.height) * 2;
  canvas.width = safeArea;
  canvas.height = safeArea;

  // Translate canvas context to a central location to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // Draw the image rotated to the center of the canvas
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  // Extract the cropped image data from the canvas
  const data = ctx.getImageData(
    safeArea / 2 - image.width * 0.5 + pixelCrop.x,
    safeArea / 2 - image.height * 0.5 + pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // Set canvas width/height to final desired size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Paste generated image data directly to the canvas
  ctx.putImageData(data, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve({ url: URL.createObjectURL(file), blob: file });
      } else {
        resolve(null);
      }
    }, "image/jpeg");
  });
}
