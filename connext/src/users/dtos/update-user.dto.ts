import { IsString, IsEmail, IsOptional, IsBoolean, IsDateString, IsInt } from 'class-validator';

export class UpdateUserDto {
  @IsInt()
  userId: number;

  @IsString()
  @IsOptional()
  userName?: string;

  @IsString()
  @IsOptional()
  passwordHashed?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  nickName?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @IsBoolean()
  @IsOptional()
  isOnline?: boolean;
}
