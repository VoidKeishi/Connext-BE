import { IsNumber, Min } from 'class-validator';

export class GetMessageDto {
  @IsNumber()
  conversationId: number;

  @IsNumber()
  @Min(1)
  limit: number;

  @IsNumber()
  @Min(1)
  offset: number;
}
