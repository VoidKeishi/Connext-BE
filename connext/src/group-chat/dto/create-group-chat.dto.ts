import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGroupChatDto {
  @IsArray()
  @IsNumber({}, { each: true })
  members: number[];

  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
