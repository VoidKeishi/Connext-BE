import { Injectable } from '@nestjs/common';
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

@Injectable()
export class GroupChatService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly groupChatRepository: GroupChatRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
  ) {}

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
      })
    );

    const creatorUser = await this.userRepository.findOneById(createdBy);

    const newGroupChat = await this.groupChatRepository.createNewGroupChat(creatorUser);

    const creatorMember = await this.groupMemberRepository.addMemberToGroup(
      newGroupChat,
      creatorUser,
      'leader',
    );

    const groupMembers: GroupMember[] = [];
    groupMembers.push(creatorMember);  
    for (const memberUser of memberUsers) {
      const newMember = await this.groupMemberRepository.addMemberToGroup(
        newGroupChat,
        memberUser,
        'user',
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
      throw new Error('Group chat does not exist');
    }
  
    await this.groupChatRepository.updateGroupChatName(groupId, groupName);
  
    const updatedGroupChat = await this.groupChatRepository.findGroupChatById(groupId);
  
    const memberIds = updatedGroupChat.members.map(member => member.userId);
  
    return {
      groupChat: updatedGroupChat,
      members: memberIds,
    };
  }
  
}
