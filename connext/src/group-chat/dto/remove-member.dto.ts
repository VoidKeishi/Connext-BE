import { IsInt } from 'class-validator';

export class RemoveMemberDto {
  @IsInt()
  groupMemberId: number;

  @IsInt()
  groupChatId: number;
}
