import { IsArray, IsInt, IsNumber } from 'class-validator';

export class AddNewMemberDto {
  @IsInt()
  groupChat: number;

  @IsArray()
  @IsNumber({}, { each: true })
  newMembers: number[];
}
