import { Conversation } from 'src/conversation/entities/conversation.entity';
import { GroupChat } from 'src/group-chat/entities/group-chat.entity';
import { GroupMember } from 'src/group-chat/entities/group-member.entity';
import { Message } from 'src/messages/entities/messages.entity';

export type SendMessageEventPayload = {
  message: Message;
  conversation: Conversation;
};

export type CreateGroupChatEventPayload = {
  groupChat: GroupChat;
  members: GroupMember[];
};

export type UpdateGroupChatNameEventPayload = {
  groupChat: GroupChat;
  members: number[];
};
