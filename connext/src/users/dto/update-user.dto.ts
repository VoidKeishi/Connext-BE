import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUrl,
  IsDate,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  nickName?: string;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dateOfBirth?: Date;

  @IsBoolean()
  @IsOptional()
  isOnline?: boolean;

  @IsDate()
  @IsOptional()
  lastActiveAt?: Date;

  @IsDate()
  @IsOptional()
  lastLogin?: Date;
}
