import { ApiProperty } from '@nestjs/swagger';

export class ConversationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ nullable: true })
  lastMessageAt: Date | null;

  @ApiProperty()
  unreadCount: number;

  @ApiProperty()
  otherParticipant: {
    id: number;
    name: string;
  };
}
