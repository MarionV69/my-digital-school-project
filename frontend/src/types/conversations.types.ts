import type { EstablishmentType } from "./establishments.types";

export type Conversation = {
  id: number;
  lastMessageAt: Date | null;
  unreadCount: number;
  otherParticipant: {
    id: number;
    name: string;
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
  endpoint: string; // "/messages/1/attachments/2"
};

export type UnreadCount = {
  count: number;
};

export type SendMessageDto = {
  content: string;
};
