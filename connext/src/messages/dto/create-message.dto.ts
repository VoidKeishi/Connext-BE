import { IsInt, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  sender_id: number;

  @IsInt()
  recipient_id: number;

  @IsInt()
  conversation_id: number;

  @IsString()
  content: string;

  @IsString()
  media_url: string;

  @IsString()
  media_type: string;
}
