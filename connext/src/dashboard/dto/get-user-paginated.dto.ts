import { IsIn, IsNumber, IsOptional, Min } from 'class-validator';

export class GetUserPaginatedDto {
  @IsNumber()
  @Min(1)
  limit: number;

  @IsNumber()
  @Min(1)
  offset: number;

  @IsOptional()
  @IsIn(['online', 'offline'])
  status?: string;
}
