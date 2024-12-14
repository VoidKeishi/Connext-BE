import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SearchUserDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsInt()
  limit: number;

  @IsInt()
  offset: number;
}
