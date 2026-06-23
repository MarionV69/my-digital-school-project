import { Establishment } from 'src/establishments/entities/establishment.entity';
import { StoredFile } from 'src/files/entities/stored-file.entity';
import { Document as EstablishmentDocument } from 'src/documents/entities/document.entity';
import { DocumentCategory } from 'src/documents/enums/document.enum';
import { Conversation } from '../entities/conversation.entity';
import { EstablishmentType } from 'src/establishments/enums/establishment-type.enum';

export const RESTAURANT_ID = 3;
export const SUPPLIER_ID = 5;
export const CONVERSATION_ID = 1;
export const MESSAGE_CONTENT = 'Hello';
export const LOGO_URL = 'https://bucket.s3.amazonaws.com/public/logo.jpg';
export const SIGNED_URL =
  'https://bucket.s3.amazonaws.com/private/doc.pdf?X-Amz-Signature=abc';

export const mockStoredFile: StoredFile = {
  id: 7,
  path: 'public/logo.jpg',
  originalFilename: 'logo.jpg',
  mimeType: 'image/jpeg',
  size: 2048,
  uploadedAt: new Date(),
  documents: [],
  messages: [],
};

export const mockDocument: EstablishmentDocument = {
  id: 1,
  establishmentId: SUPPLIER_ID,
  fileId: mockStoredFile.id,
  category: DocumentCategory.LOGO,
  createdAt: new Date(),
  file: mockStoredFile,
  establishment: {} as Establishment,
};

export const mockConversation: Partial<Conversation> = {
  id: CONVERSATION_ID,
  restaurantId: RESTAURANT_ID,
  supplierId: SUPPLIER_ID,
  lastMessageAt: null,
};

export const mockSupplierEstablishment: Partial<Establishment> = {
  id: SUPPLIER_ID,
  tradeName: 'Fruits Bio',
  legalName: 'Fruits Bio SARL',
  documents: [mockDocument],
};

export const mockConversationWithRelations: Partial<Conversation> = {
  ...mockConversation,
  supplier: mockSupplierEstablishment as Establishment,
  lastMessageAt: null,
};

export const mockRestaurantUser = {
  id: 1,
  establishmentId: RESTAURANT_ID,
  establishmentType: EstablishmentType.RESTAURANT,
};
