import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IAddNewMembers } from '../interfaces/add-new-members.interface';
import { GroupMemberRepository } from '../repositories/group-member.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { GroupChatRepository } from '../repositories/group-chat.repository';
import { AddNewMemberEventPayload, LeaveGroupEventPayload, RemoveMemberEventPayload } from 'src/common/types';
import { IRemoveMember } from '../interfaces/remove-member.interface';
import { ILeaveGroup } from '../interfaces/leave-group.interface';


@Injectable()
export class GroupMemberService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly groupChatRepository: GroupChatRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
  ) {}

  async addNewMembers(
    addNewMembersData: IAddNewMembers,
  ): Promise<AddNewMemberEventPayload> {
    const { groupChat, issuer, members } = addNewMembersData;
  
    const issuerUser = await this.userRepository.findOneById(issuer);
    if (!issuerUser || issuerUser.role !== 'leader') {
      throw new BadRequestException('Only a leader can add new members.');
    }
  
    const groupChatEntity = await this.groupChatRepository.findGroupChatById(groupChat);
    if (!groupChatEntity) {
      throw new BadRequestException('Group chat does not exist.');
    }
  
    const newMembers = [];
  
    for (const memberId of members) {
      const memberUser = await this.userRepository.findOneById(memberId);
      if (!memberUser) {
        throw new NotFoundException(`User not found.`);
      }
  
      const existingMember = await this.groupMemberRepository.findGroupMemberById(memberId);
      if (existingMember) {
        throw new BadRequestException(`User is already a member of the group.`);
      }
  
      const newGroupMember = await this.groupMemberRepository.addMemberToGroup(
        groupChatEntity,
        memberUser,
        'user', 
      );
  
      newMembers.push(newGroupMember);
    }
  
    return {
      groupChat: groupChatEntity,
      leader: issuerUser, 
      newMembers,  
    };
  }
  
  async removeGroupMember(
    removeMemberData: IRemoveMember,
  ): Promise<RemoveMemberEventPayload> {
    const { groupChatId, issuer, groupMemberId } = removeMemberData;
  
    const issuerUser = await this.userRepository.findOneById(issuer);
    if (!issuerUser || issuerUser.role !== 'leader') {
      throw new BadRequestException('Only a leader can remove a member.');
    }
  
    const groupChatEntity = await this.groupChatRepository.findGroupChatById(groupChatId);
    if (!groupChatEntity) {
      throw new BadRequestException('Group chat does not exist.');
    }
  
    const groupMember = await this.groupMemberRepository.findGroupMemberById(groupMemberId);
    if (!groupMember) {
      throw new NotFoundException('User is not a member of the group.');
    }

    await this.groupMemberRepository.deleteGroupMember(groupMember, groupChatEntity);
  
    return {
      groupChat: groupChatEntity,
      removedMember: groupMember,
    };
  }
  
  async leaveGroupChat(
    leaveGroupData: ILeaveGroup,
  ): Promise<LeaveGroupEventPayload> {
    const { groupChatId, userId } = leaveGroupData;

    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const groupChatEntity = await this.groupChatRepository.findGroupChatById(groupChatId);
    if (!groupChatEntity) {
      throw new BadRequestException('Group chat does not exist.');
    }

    const groupMember = await this.groupMemberRepository.findGroupMemberById(userId);
    if (!groupMember) {
      throw new NotFoundException('User is not a member of the group.');
    }
  
    await this.groupMemberRepository.deleteGroupMember(groupMember, groupChatEntity);
  
    return {
      groupChat: groupChatEntity,
      leaveMember: user,
    };
  }
  
}
