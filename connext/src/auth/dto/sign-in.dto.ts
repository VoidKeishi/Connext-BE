import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  username?: string;
}
