import { EstablishmentType } from '../../establishments/enums/establishment-type.enum';

interface MessageData {
  senderType: EstablishmentType;
  content: string;
  sentAt: Date;
  isReadByRecipient: boolean;
  attachment?: {
    originalFilename: string;
    mimeType: string;
    size: number;
    path: string;
  };
}

// Constant messages for conversations
const MESSAGES_NEGOCIATION: MessageData[] = [
  {
    senderType: EstablishmentType.RESTAURANT,
    content: 'Bonjour, vos produits nous intéressent.',
    sentAt: new Date('2026-03-07T09:00:00'),
    isReadByRecipient: true,
  },
  {
    senderType: EstablishmentType.RESTAURANT,
    content:
      'Proposez-vous la possibilité de faire un test avant de travailler ensemble ?',
    sentAt: new Date('2026-03-07T09:05:00'),
    isReadByRecipient: true,
  },
  {
    senderType: EstablishmentType.SUPPLIER,
    content:
      'Bonjour, oui c’est tout à fait possible. Nous pouvons organiser un premier test et discuter des conditions ensuite.',
    sentAt: new Date('2026-03-07T09:06:00'),
    isReadByRecipient: true,
  },
  {
    senderType: EstablishmentType.RESTAURANT,
    content:
      'Et avez-vous des tarifs préférentiels en cas d’engagement sur plusieurs mois ?',
    sentAt: new Date('2026-03-07T09:30:00'),
    isReadByRecipient: true,
  },

  {
    senderType: EstablishmentType.SUPPLIER,
    content:
      "Nous proposons des abonnements à partir de 6 mois d'engagement avec tarifs préférentiels et avantages adaptés selon les volumes de commandes. Je vous mets en pièces joint notre brochure d'abonnements pour que vous puissiez voir les différentes options disponibles.",
    sentAt: new Date('2026-03-07T09:35:00'),
    isReadByRecipient: false,
    attachment: {
      originalFilename: 'abonnements.pdf',
      mimeType: 'application/pdf',
      size: 500000,
      path: 'private/abonnements.pdf',
    },
  },
];

const MESSAGES_DELIVERY_ZONE: MessageData[] = [
  {
    senderType: EstablishmentType.RESTAURANT,
    content: 'Bonjour, nous cherchons de nouveaux fournisseurs.',
    sentAt: new Date('2026-03-06T11:00:00'),
    isReadByRecipient: true,
  },
  {
    senderType: EstablishmentType.RESTAURANT,
    content: 'Pouvez-vous me confirmer vos zones de livraison ?',
    sentAt: new Date('2026-03-06T11:05:00'),
    isReadByRecipient: true,
  },
  {
    senderType: EstablishmentType.SUPPLIER,
    content:
      'Bonjour, nous livrons sur plusieurs zones à Lyon et alentours. Vous pouvez consulter le détail directement sur notre profil, les informations sont à jour.',
    sentAt: new Date('2026-03-06T11:30:00'),
    isReadByRecipient: true,
  },
];

// Conversations data
export const conversationsData = [
  // LE GOURMET LYONNAIS (suppliers 1 → 4)
  {
    restaurantEmail: 'contact@legourmet-lyon.com',
    supplierEmail: 'contact@fermebio-beaujolais.com',
    messages: MESSAGES_NEGOCIATION,
  },
  {
    restaurantEmail: 'contact@legourmet-lyon.com',
    supplierEmail: 'info@fromagerie-montsdulyonnais.com',
    messages: MESSAGES_DELIVERY_ZONE,
  },
  {
    restaurantEmail: 'contact@legourmet-lyon.com',
    supplierEmail: 'hello@boulangerie-perouges.com',
    messages: MESSAGES_NEGOCIATION,
  },
  {
    restaurantEmail: 'contact@legourmet-lyon.com',
    supplierEmail: 'hello@elevage-charolais-rhone.com',
    messages: MESSAGES_DELIVERY_ZONE,
  },

  // BOUCHON LYONNAIS (suppliers 5 → 8)
  {
    restaurantEmail: 'hello@bouchonlyonnais.com',
    supplierEmail: 'contact@caviste-beaujolais.com',
    messages: MESSAGES_NEGOCIATION,
  },
  {
    restaurantEmail: 'hello@bouchonlyonnais.com',
    supplierEmail: 'contact@maraicher-dombes.com',
    messages: MESSAGES_DELIVERY_ZONE,
  },
  {
    restaurantEmail: 'hello@bouchonlyonnais.com',
    supplierEmail: 'pro@poissonnerie-halles.com',
    messages: MESSAGES_NEGOCIATION,
  },
  {
    restaurantEmail: 'hello@bouchonlyonnais.com',
    supplierEmail: 'contact@cremerie-ainoise.com',
    messages: MESSAGES_DELIVERY_ZONE,
  },

  // BRASSERIE CONFLUENCE (suppliers 9 → 13)
  {
    restaurantEmail: 'contact@brasserieconfluence.com',
    supplierEmail: 'contact@epicerie-biolyonnais.com',
    messages: MESSAGES_NEGOCIATION,
  },
  {
    restaurantEmail: 'contact@brasserieconfluence.com',
    supplierEmail: 'contact@fournil-lyonnais.com',
    messages: MESSAGES_DELIVERY_ZONE,
  },
  {
    restaurantEmail: 'contact@brasserieconfluence.com',
    supplierEmail: 'info@boucherie-duchesne.com',
    messages: MESSAGES_NEGOCIATION,
  },
  {
    restaurantEmail: 'contact@brasserieconfluence.com',
    supplierEmail: 'info@cave-vallee-rhone.com',
    messages: MESSAGES_DELIVERY_ZONE,
  },
  {
    restaurantEmail: 'contact@brasserieconfluence.com',
    supplierEmail: 'pro@primeurs-croixrousse.com',
    messages: MESSAGES_NEGOCIATION,
  },
];
