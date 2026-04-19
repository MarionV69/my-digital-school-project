import { ApiProperty } from '@nestjs/swagger';

export class MessageAttachmentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'document.pdf' })
  originalFilename: string;

  @ApiProperty({ example: 'application/pdf' })
  mimeType: string;

  @ApiProperty({ example: 102400 })
  size: number;

  @ApiProperty({ example: '/conversations/1/messages/2/attachments/3' })
  endpoint: string;
}
