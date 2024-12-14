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

@Injectable()
export class GroupChatService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly groupChatRepository: GroupChatRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
  ) {}

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

    const memberUsers = await Promise.all(
      members.map(async (memberId) => {
        const user = await this.userRepository.findOneById(memberId);
        if (!user) {
          throw new NotFoundException(`user not found`);
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

    const foundGroupMembers =
      await this.groupMemberRepository.findGroupMemberByGroup(updatedGroupChat);
    const foundGroupMemberIds = [];
    for (let i = 0; i < foundGroupMembers.length; i++) {
      foundGroupMemberIds.push(foundGroupMembers[i].user_id.userId);
    }

    return {
      groupChat: updatedGroupChat,
      members: foundGroupMemberIds,
    };
  }
}
