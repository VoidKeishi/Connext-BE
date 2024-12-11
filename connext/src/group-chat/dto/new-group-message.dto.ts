import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { MEDIA_TYPE } from 'src/common/enum/media-type.enum';

export class NewGroupMessageDto {
  @IsInt()
  groupId: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  mediaUrl?: string | null;

  @IsEnum(MEDIA_TYPE)
  mediaType: MEDIA_TYPE;
}
