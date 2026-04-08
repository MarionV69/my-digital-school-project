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

export const openAttachment = async (endpoint: string): Promise<void> => {
  const response = await api.get<{ url: string }>(endpoint);
  window.open(response.data.url, "_blank");
};
