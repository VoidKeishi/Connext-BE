import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Message } from 'src/messages/entities/messages.entity';

export type SendMessageEventPayload = {
  message: Message;
  conversation: Conversation;
};
