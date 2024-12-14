import { MEDIA_TYPE } from 'src/common/enum/media-type.enum';

export interface INewGroupMessage {
  groupId: number;
  senderId: number;
  content: string;
  mediaUrl: string | null;
  mediaType: MEDIA_TYPE;
}
