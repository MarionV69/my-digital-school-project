import { randomUUID } from 'crypto';
import { diskStorage, FileFilterCallback } from 'multer';
import { extname } from 'path';
import { PRIVATE_UPLOAD_PATH, PUBLIC_UPLOAD_PATH } from './storage.config';
import { BadRequestException } from '@nestjs/common';

const generateFileName = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) => {
  const uniqueName = randomUUID() + extname(file.originalname);
  cb(null, uniqueName);
};

const allowedMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
];

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new BadRequestException(
        `Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}`,
      ),
    );
  }
  cb(null, true);
};

export const multerPublicOptions = {
  storage: diskStorage({
    destination: PUBLIC_UPLOAD_PATH,
    filename: generateFileName,
  }),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter,
};

export const multerPrivateOptions = {
  storage: diskStorage({
    destination: PRIVATE_UPLOAD_PATH,
    filename: generateFileName,
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter,
};
