import { PartialType } from '@nestjs/mapped-types';
import { CreateFriendDto } from './create-friend-request.dto';

export class UpdateFriendDto extends PartialType(CreateFriendDto) { }
