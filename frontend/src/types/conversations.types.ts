import type { EstablishmentType } from "./establishments.types";

export type Conversation = {
  id: number;
  lastMessageAt: Date | null;
  unreadCount: number;
  otherParticipant: {
    id: number;
    name: string;
    avatarUrl: string | null;
  };
};

export type Message = {
  id: number;
  conversationId: number;
  senderType: EstablishmentType;
  content: string;
  sentAt: Date;
  isReadByRecipient: boolean;
  attachments: MessageAttachment[];
};

export type MessageAttachment = {
  id: number;
  originalFilename: string;
  mimeType: string;
  size: number;
  endpoint: string; // "/conversations/1/messages/2/attachments/3"
};

export type UnreadCount = {
  count: number;
};
