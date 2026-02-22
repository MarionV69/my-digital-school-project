import { join } from 'path';

// Upload directory
export const UPLOAD_DIR = 'uploads';

// Absolute path to the upload directory
export const UPLOAD_PATH = join(process.cwd(), UPLOAD_DIR);

// Subdirectories for public and private uploads
export const PUBLIC_UPLOAD_PATH = join(UPLOAD_PATH, 'public', 'documents');
export const PRIVATE_UPLOAD_PATH = join(UPLOAD_PATH, 'private', 'attachments');

// Public static url prefix for accessing uploaded public files
export const PUBLIC_STATIC_URL_PREFIX = '/documents';
