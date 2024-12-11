export interface INewGroupMessage {
  groupId: number;
  senderId: number;
  content: string;
  mediaUrl: string | null;
  mediaType: 'text' | 'image' | 'video';
}
