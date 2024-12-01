import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional, IsBoolean, IsDateString, IsInt, IsUrl, IsDate } from 'class-validator';

@InputType()
export class UpdateUserDto {
  @IsInt()
  @Field()
  userId: number;

  @IsString()
  @IsOptional()
  @Field()
  userName?: string;

  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @IsOptional()
  @Field()
  nickName?: string;

  @IsUrl()
  @IsOptional()
  @Field()
  avatarUrl?: string;

  @IsDate()
  @IsOptional()
  @Field()
  dateOfBirth?: Date;

  @IsBoolean()
  @Field()
  isOnline: boolean;
}
