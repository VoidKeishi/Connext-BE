import { Injectable } from '@nestjs/common';
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
    // TODO 1: Check if userAdd has role 'leader'. If not, throw BadRequestException
    // TODO 2: Check if group chat is exist. If not, throw BadRequestException
    // TODO 3: Create a variable to hold an array of new member (newMembers)
    // Make a for loop through each members:
    // - First check if each user is exist or not. If not, throw NotFoundException
    // - Next create a new data for group member
    // - Push the new data to newMembers
    // TODO 4: Return data that has the same type as AddNewMemberEventPayload
  }

  async removeGroupMember(
    removeMemberData: IRemoveMember,
  ): Promise<RemoveMemberEventPayload> {
    // TODO 1: Check if userAdd has role 'leader'. If not, throw BadRequestException
    // TODO 2: Check if group chat is exist. If not, throw BadRequestException
    // TODO 3: Check if group member is exist. If not, throw NotFoundException
    // TODO 4: Remove this group member using groupMemberRepository.deleteGroupMember
    // TODO 5: Return data that has the same type as RemoveMemberEventPayload
  }

  async leaveGroupChat(
    leaveGroupData: ILeaveGroup,
  ): Promise<LeaveGroupEventPayload> {
    // TODO 1: Get user infomation
    // TODO 2: Check if group chat is exist. If not, throw BadRequestException
    // TODO 3: Check if this user exist in this group chat. If not, throw NotFoundException
    // TODO 4: Remove this user from group chat using groupMemberRepository.deleteGroupMember
    // TODO 5: Return data that has the same type as LeaveGroupEventPayload
  }
}
