export const DocumentCategory = {
  LOGO: "LOGO",
  COVER_PHOTO: "COVER_PHOTO",
  CATALOG: "CATALOG",
  GALLERY_PHOTO: "GALLERY_PHOTO",
} as const;

export type DocumentCategory =
  (typeof DocumentCategory)[keyof typeof DocumentCategory];

export type FileResponse = {
  id: number;
  originalFilename: string;
  mimeType: string;
  size: number;
  url: string;
};

export type DocumentItem = {
  id: number;
  file: FileResponse;
};

export type GroupedDocuments = {
  LOGO: DocumentItem[];
  COVER_PHOTO: DocumentItem[];
  CATALOG: DocumentItem[];
  GALLERY_PHOTO: DocumentItem[];
};

export type DocumentResponse = {
  id: number;
  category: DocumentCategory;
  file: FileResponse;
};

export type UploadDocumentDto = {
  file: File;
  category: DocumentCategory;
};
