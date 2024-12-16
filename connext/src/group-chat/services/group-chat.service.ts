import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/repositories/user.repository';
import { GroupChatRepository } from '../repositories/group-chat.repository';
import { GroupMemberRepository } from '../repositories/group-member.repository';
import { INewGroupChat } from '../interfaces/new-group-chat.interface';
import {
  CreateGroupChatEventPayload,
  UpdateGroupChatNameEventPayload,
} from 'src/common/types';
import { IUpdateGroupChatName } from '../interfaces/update-group-chat-name.interface';
import { NotFoundException } from '@nestjs/common';
import { GroupMember } from '../entities/group-member.entity';
import { GroupChat } from '../entities/group-chat.entity';
import { GroupMemberRole } from 'src/common/enum/group-member-role.enum';
import { FriendshipRepository } from 'src/friends/repositories/friendship.repository';

@Injectable()
export class GroupChatService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly groupChatRepository: GroupChatRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
    private readonly friendshipRepository: FriendshipRepository,
  ) {}

  async getUserGroupChats(userId: number): Promise<GroupChat[]> {
    const userCreatedGroupChats =
      await this.groupChatRepository.findUserCreatedGroupChats(userId);
    console.log(
      '🚀 ~ GroupChatService ~ getUserGroupChats ~ userCreatedGroupChats:',
      userCreatedGroupChats,
    );
    const userJoinedGroupChats =
      await this.groupMemberRepository.findGroupMemberByUser(userId);
    console.log(
      '🚀 ~ GroupChatService ~ getUserGroupChats ~ userJoinedGroupChats:',
      userJoinedGroupChats,
    );
    const userGroupChats = [...userCreatedGroupChats];
    for (let i = 0; i < userJoinedGroupChats.length; i++) {
      const foundGroupChat = await this.groupChatRepository.findGroupChatById(
        userJoinedGroupChats[i].group_id.group_id,
      );
      if (foundGroupChat) userGroupChats.push(foundGroupChat);
    }
    console.log(
      '🚀 ~ GroupChatService ~ getUserGroupChats ~ userGroupChats:',
      userGroupChats,
    );
    return userGroupChats;
  }

  async getGroupChatDetail(groupChatId: number): Promise<GroupChat> {
    const foundGroupChat =
      await this.groupChatRepository.findGroupChatById(groupChatId);
    if (!foundGroupChat) throw new NotFoundException('No group chat found!');
    return foundGroupChat;
  }

  async createNewGroupChat(
    newGroupChatData: INewGroupChat,
  ): Promise<CreateGroupChatEventPayload> {
    const { createdBy, members } = newGroupChatData;

    if (members.length < 2)
      throw new BadRequestException(
        'Need at least two members to create new group',
      );

    if (members.includes(createdBy))
      throw new BadRequestException('Can not invite yourself to new group');

    for (let i = 0; i < members.length; i++) {
      const isFriend = await this.friendshipRepository.getOneFriend(
        createdBy,
        members[i],
      );
      if (!isFriend)
        throw new BadRequestException('All member must be your friend');
    }

    const memberUsers = await Promise.all(
      members.map(async (memberId) => {
        const user = await this.userRepository.findOneById(memberId);
        if (!user) {
          throw new NotFoundException(`User not found`);
        }
        return user;
      }),
    );

    const creatorUser = await this.userRepository.findOneById(createdBy);

    const newGroupChat =
      await this.groupChatRepository.createNewGroupChat(creatorUser);
    const foundGroupMember =
      await this.groupMemberRepository.findGroupMemberByGroupAndUser(
        newGroupChat,
        creatorUser,
      );
    if (foundGroupMember)
      throw new BadRequestException('User already in group chat!');

    const creatorMember = await this.groupMemberRepository.createNewGroupMember(
      newGroupChat,
      creatorUser,
      GroupMemberRole.LEADER,
    );
    const groupMembers: GroupMember[] = [];
    groupMembers.push(creatorMember);
    for (const memberUser of memberUsers) {
      const newMember = await this.groupMemberRepository.createNewGroupMember(
        newGroupChat,
        memberUser,
        GroupMemberRole.MEMBER,
      );
      groupMembers.push(newMember);
    }
    console.log('🚀 ~ GroupChatService ~ groupMembers:', groupMembers);

    return {
      groupChat: newGroupChat,
      members: groupMembers,
    };
  }

  async updateGroupChatName(
    updateGroupChatNameData: IUpdateGroupChatName,
  ): Promise<UpdateGroupChatNameEventPayload> {
    const { groupId, groupName } = updateGroupChatNameData;

    const groupChat = await this.groupChatRepository.findGroupChatById(groupId);
    if (!groupChat) {
      throw new NotFoundException('Group chat does not exist');
    }

    const updatedGroupChat = await this.groupChatRepository.updateGroupChatName(
      groupId,
      groupName,
    );

    return {
      groupChat: updatedGroupChat,
    };
  }
}
