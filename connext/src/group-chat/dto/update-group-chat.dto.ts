import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateGroupChatDto {
  @IsInt()
  groupId: number;

  @IsString()
  @IsNotEmpty()
  groupName: string;
}
