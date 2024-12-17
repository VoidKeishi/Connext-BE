import { IsNumber, Min } from 'class-validator';

export class GetConversationsDto {
  @IsNumber()
  @Min(1)
  limit: number;

  @IsNumber()
  @Min(1)
  offset: number;
}
