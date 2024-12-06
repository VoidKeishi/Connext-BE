import { Type } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsUrl, IsDate } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  userName?: string;

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
  isOnline: boolean;

  @IsDate()
  lastActiveAt: Date;

  @IsDate()
  lastLogin: Date;
}