import type {
  DocumentCategory,
  DocumentResponse,
  GroupedDocuments,
} from "../types/documents.types";
import api from "./axiosConfig";

// Upload a public document (logo, cover photo, catalog, gallery photo) for the establishment
export const uploadDocument = async (
  file: File,
  category: DocumentCategory,
): Promise<DocumentResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);

  const response = await api.post("/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Fetch all documents for the establishment, grouped by category
export const getDocuments = async (): Promise<GroupedDocuments> => {
  const response = await api.get("/documents");
  return response.data;
};

// Delete a document by its ID
export const deleteDocument = async (documentId: number): Promise<void> => {
  await api.delete(`/documents/${documentId}`);
};
