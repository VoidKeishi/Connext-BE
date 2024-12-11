import { IsInt } from 'class-validator';

export class LeaveGroupDto {
  @IsInt()
  groupChatId: number;
}
