import { ApiProperty } from '@nestjs/swagger';

export class ConversationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2026-02-22T13:49:30.364Z', nullable: true })
  lastMessageAt: Date | null;

  @ApiProperty({ example: 3 })
  unreadCount: number;

  @ApiProperty({
    example: { id: 5, name: 'Martin Bio' },
  })
  otherParticipant: {
    id: number;
    name: string;
  };
}
