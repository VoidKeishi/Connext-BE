import { IsString, IsEmail, IsOptional, IsBoolean, IsDateString } from 'class-validator';

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

  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @IsBoolean()
  isOnline: boolean;
}
