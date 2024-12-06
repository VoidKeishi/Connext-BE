import { IsInt, IsString } from 'class-validator';

export class NewMessageDto {
  @IsInt()
  conversation_id: number;

  @IsString()
  content: string;

  @IsString()
  media_url: string;

  @IsString()
  media_type: string;
}
