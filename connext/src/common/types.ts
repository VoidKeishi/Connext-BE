import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Friendship } from 'src/friends/entities/friendship.entity';
import { GroupChat } from 'src/group-chat/entities/group-chat.entity';
import { GroupMember } from 'src/group-chat/entities/group-member.entity';
import { GroupMessage } from 'src/group-chat/entities/group-message.entity';
import { Message } from 'src/messages/entities/messages.entity';

export type SendMessageEventPayload = {
  message: Message;
};

export type CreateGroupChatEventPayload = {
  groupChat: GroupChat;
  members: GroupMember[];
};

export type UpdateGroupChatNameEventPayload = {
  groupChat: GroupChat;
};

export type AddNewMemberEventPayload = {
  groupChat: GroupChat;
  leader: GroupMember;
  newMembers: GroupMember[];
};

export type RemoveMemberEventPayload = {
  groupChat: GroupChat;
  removedMember: GroupMember;
};

export type LeaveGroupEventPayload = {
  groupChat: GroupChat;
  leaveMember: GroupMember;
  newLeader: GroupMember;
};

export type SendGroupMessageEventPayload = {
  groupMessage: GroupMessage;
};

export type NewFriendRequestEventPayload = {
  newFriendRequest: Friendship;
};

export type AcceptFriendRequestEventPayload = {
  newConversation: Conversation;
};
