export const mockConversationsRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn(),
};

export const mockMessagesRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn(),
};

export const mockEstablishmentsRepository = {
  findOne: jest.fn(),
};

export const mockFilesService = {
  create: jest.fn(),
  getPrivateFileSignedUrl: jest.fn(),
  getPublicFileUrl: jest.fn(),
};

export const mockDocumentsService = {
  getAllDocumentUrls: jest.fn(),
};
