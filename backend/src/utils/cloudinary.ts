import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import dotenv from 'dotenv';

// Ensure environment variables are loaded before configuring
dotenv.config();

export interface CloudinaryImage {
  url: string;
  public_id: string;
}

// Configure Cloudinary with your environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadBufferToCloudinary = (
  fileBuffer: Buffer,
  folder = 'products'
): Promise<CloudinaryImage> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
    Readable.from(fileBuffer).pipe(stream);
  });
};

// Utility to delete an image from the cloud
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Deleted image from Cloudinary: ${publicId}`);
    } catch (error) {
        console.error(`❌ Cloudinary Deletion Error for ${publicId}:`, error);
    }
};