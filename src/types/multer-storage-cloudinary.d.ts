declare module "multer-storage-cloudinary" {
  interface CloudinaryStorageOptions {
    cloudinary: unknown;
    params?: Record<string, unknown>;
  }

  export class CloudinaryStorage {
    constructor(options: CloudinaryStorageOptions);
  }
}