import { IsInt, Min } from 'class-validator';

export class FindManyUserDto {
  @IsInt()
  @Min(1)
  limit: number;

  @IsInt()
  @Min(1)
  offset: number;
}
