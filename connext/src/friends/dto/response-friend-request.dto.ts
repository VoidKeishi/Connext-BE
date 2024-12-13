import { IsInt, IsNotEmpty } from 'class-validator';

export class ResponseFriendRequestDto {
  @IsInt()
  @IsNotEmpty()
  friendRequestId: number;
}
