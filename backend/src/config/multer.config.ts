import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PRIVATE_UPLOAD_PATH, PUBLIC_UPLOAD_PATH } from './storage.config';

const generateFileName = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) => {
  const uniqueName = randomUUID() + extname(file.originalname);
  cb(null, uniqueName);
};

export const multerPublicOptions = {
  storage: diskStorage({
    destination: PUBLIC_UPLOAD_PATH,
    filename: generateFileName,
  }),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
};

export const multerPrivateOptions = {
  storage: diskStorage({
    destination: PRIVATE_UPLOAD_PATH,
    filename: generateFileName,
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
};
