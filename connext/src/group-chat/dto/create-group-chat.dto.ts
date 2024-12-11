import { IsArray, IsNumber } from 'class-validator';

export class CreateGroupChatDto {
  @IsArray()
  @IsNumber({}, { each: true })
  members: number[];
}
