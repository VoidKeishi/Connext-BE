import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IAddNewMembers } from '../interfaces/add-new-members.interface';
import { GroupMemberRepository } from '../repositories/group-member.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { GroupChatRepository } from '../repositories/group-chat.repository';
import {
  AddNewMemberEventPayload,
  LeaveGroupEventPayload,
  RemoveMemberEventPayload,
} from 'src/common/types';
import { IRemoveMember } from '../interfaces/remove-member.interface';
import { ILeaveGroup } from '../interfaces/leave-group.interface';
import { GroupMemberRole } from 'src/common/enum/group-member-role.enum';

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

    const issuerUser =
      await this.groupMemberRepository.findGroupMemberById(issuer);
    if (issuerUser.role !== GroupMemberRole.LEADER) {
      throw new BadRequestException('Only a leader can add new members.');
    }

    const groupChatEntity =
      await this.groupChatRepository.findGroupChatById(groupChat);
    if (!groupChatEntity) {
      throw new BadRequestException('Group chat does not exist.');
    }

    const newMembers = [];
    for (const memberId of members) {
      const foundMember = await this.userRepository.findOneById(memberId);
      if (!foundMember) {
        throw new NotFoundException('User not found.');
      }

      const existingMember =
        await this.groupMemberRepository.findGroupMemberById(memberId);
      if (existingMember) {
        throw new BadRequestException(
          'User is already a member of this group.',
        );
      }

      const newGroupMember =
        await this.groupMemberRepository.createNewGroupMember(
          groupChatEntity,
          foundMember,
          GroupMemberRole.MEMBER,
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

    const issuerUser =
      await this.groupMemberRepository.findGroupMemberById(issuer);
    if (issuerUser.role !== GroupMemberRole.LEADER) {
      throw new BadRequestException('Only a leader can remove a member.');
    }

    const groupChatEntity =
      await this.groupChatRepository.findGroupChatById(groupChatId);
    if (!groupChatEntity) {
      throw new BadRequestException('Group chat does not exist.');
    }

    const groupMember =
      await this.groupMemberRepository.findGroupMemberById(groupMemberId);
    if (!groupMember) {
      throw new NotFoundException('User is not a member of the group.');
    }

    await this.groupMemberRepository.deleteGroupMember(
      groupMember,
      groupChatEntity,
    );

    return {
      groupChat: groupChatEntity,
      removedMember: groupMember,
    };
  }

  async leaveGroupChat(
    leaveGroupData: ILeaveGroup,
  ): Promise<LeaveGroupEventPayload> {
    const { groupChatId, userId } = leaveGroupData;

    const foundUser = await this.userRepository.findOneById(userId);

    const groupChatEntity =
      await this.groupChatRepository.findGroupChatById(groupChatId);
    if (!groupChatEntity) {
      throw new BadRequestException('Group chat does not exist.');
    }

    const groupMember =
      await this.groupMemberRepository.findGroupMemberByGroupAndUser(
        groupChatEntity,
        foundUser,
      );
    if (!groupMember) {
      throw new NotFoundException('User is not a member of the group.');
    }

    await this.groupMemberRepository.deleteGroupMember(
      groupMember,
      groupChatEntity,
    );

    return {
      groupChat: groupChatEntity,
      leaveMember: groupMember,
    };
  }
}
