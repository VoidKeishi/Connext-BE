import { IsString, IsEmail, IsOptional, IsEnum, IsDate } from 'class-validator';
import { Role } from 'src/auth/role-enum';

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

  @IsEnum(Role)
  role: Role;
}