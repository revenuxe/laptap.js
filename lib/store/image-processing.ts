import sharp from 'sharp';
export const MAX_SOURCE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_BYTES = 300 * 1024;
export const TARGET_IMAGE_BYTES = 220 * 1024;
export class ImageUploadError extends Error {
 constructor(message: string, public status = 422) { super(message); }
}
/** Decode trusted raster formats, orient before stripping EXIF, and enforce an output budget. */
export async function optimizeProductImage(input: Buffer) {
 if (!input.length || input.length > MAX_SOURCE_BYTES) throw new ImageUploadError('Choose a photo between 1 byte and 5 MB.', 413);
 const jpeg = input.length > 3 && input[0] === 0xff && input[1] === 0xd8 && input[2] === 0xff;
 const png = input.length > 8 && input.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
 const webp = input.length > 12 && input.toString('ascii', 0, 4) === 'RIFF' && input.toString('ascii', 8, 12) === 'WEBP';
 if (!jpeg && !png && !webp) throw new ImageUploadError('Use a genuine JPG, PNG, or WebP photo.');
 try {
  const options = { limitInputPixels: 40_000_000, failOn: 'warning' as const };
  const metadata = await sharp(input, options).metadata();
  if (!['jpeg', 'png', 'webp'].includes(metadata.format || '')) throw new ImageUploadError('Use a genuine JPG, PNG, or WebP photo.');
  if ((metadata.pages || 1) > 1) throw new ImageUploadError('Use a still photo rather than an animated image.');
  let smallest: { data: Buffer; width: number; height: number } | undefined;
  for (const size of [1600, 1200, 1000]) {
   for (const quality of [80, 66]) {
    const { data, info } = await sharp(input, options).rotate().resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true }).toColourspace('srgb').webp({ quality, effort: 4 }).timeout({ seconds: 8 }).toBuffer({ resolveWithObject: true });
    const result = { data, width: info.width, height: info.height };
    if (!smallest || data.length < smallest.data.length) smallest = result;
    if (data.length <= TARGET_IMAGE_BYTES) return { ...result, originalBytes: input.length };
   }
  }
  if (smallest && smallest.data.length <= MAX_IMAGE_BYTES) return { ...smallest, originalBytes: input.length };
  throw new ImageUploadError('This photo is too complex to optimize clearly. Try a closer, simpler photo.');
 } catch (error) {
  if (error instanceof ImageUploadError) throw error;
  throw new ImageUploadError('This photo could not be decoded safely. Export it as JPG, PNG, or WebP and try again.');
 }
}
