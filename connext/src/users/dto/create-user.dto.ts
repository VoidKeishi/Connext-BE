import { IsString, IsEmail, IsOptional, IsBoolean, IsDate } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  userName?: string;

  @IsString()
  passwordHashed: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  nickName?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @IsBoolean()
  isOnline: boolean;
}