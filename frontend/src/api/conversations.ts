import type {
  Conversation,
  Message,
  MessageAttachment,
  UnreadCount,
} from "../types/conversations.types";
import api from "./axiosConfig";

export const createConversation = async (
  supplierId: number,
): Promise<Conversation> => {
  const response = await api.post<Conversation>("/conversations", {
    supplierId,
  });
  return response.data;
};

export const sendMessage = async (
  conversationId: number,
  content: string,
): Promise<Message> => {
  const response = await api.post<Message>(
    `/conversations/${conversationId}/messages`,
    { content },
  );
  return response.data;
};

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get<Conversation[]>("/conversations");
  return response.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get<UnreadCount>("/conversations/unread-count");
  return response.data.count;
};

export const getConversationMessages = async (
  conversationId: number,
): Promise<Message[]> => {
  const response = await api.get<Message[]>(
    `/conversations/${conversationId}/messages`,
  );
  return response.data;
};

export const sendAttachment = async (
  messageId: number,
  file: File,
): Promise<MessageAttachment> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<MessageAttachment>(
    `/messages/${messageId}/attachments`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

// Open attachment in a new tab by fetching the file as a blob and creating a URL for it
export const openAttachment = async (endpoint: string): Promise<void> => {
  const response = await api.get(endpoint, {
    responseType: "blob",
  });

  const url = URL.createObjectURL(response.data);
  window.open(url, "_blank");

  // Cleanup after file is loaded in new tab
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};
