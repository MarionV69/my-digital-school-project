import { ApiProperty } from '@nestjs/swagger';
import { EstablishmentType } from '../../establishments/enums/establishment-type.enum';
import { MessageAttachmentResponseDto } from './message-attachments-response.dto';

export class MessageResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 2 })
  conversationId: number;

  @ApiProperty({ enum: EstablishmentType })
  senderType: EstablishmentType;

  @ApiProperty({ example: 'Quels sont vos délais de livraison ?' })
  content: string;

  @ApiProperty({ example: '2026-02-26T20:15:25.000Z' })
  sentAt: Date;

  @ApiProperty({ example: false })
  isReadByRecipient: boolean;

  @ApiProperty({ type: [MessageAttachmentResponseDto] })
  attachments: MessageAttachmentResponseDto[];
}
