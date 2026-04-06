import { FileFilterCallback, memoryStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';

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

export const multerOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 Mo
  },
  fileFilter,
};
