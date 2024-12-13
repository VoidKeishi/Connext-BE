import { MEDIA_TYPE } from 'src/common/enum/media-type.enum';

export interface INewMessage {
  senderId: number;
  recipientId: number;
  conversationId: number;
  content: string;
  mediaUrl: string;
  mediaType: MEDIA_TYPE;
}
