import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupChat } from '../entities/group-chat.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { GroupMember } from '../entities/group-member.entity';
import { GroupMemberRole } from 'src/common/enum/group-member-role.enum';

@Injectable()
export class GroupMemberRepository {
  constructor(
    @InjectRepository(GroupChat)
    private readonly groupChatRepository: Repository<GroupChat>,
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findGroupMemberByGroupAndUser(
    groupChat: GroupChat,
    user: User,
  ): Promise<GroupMember | null> {
    const foundGroupMember = await this.groupMemberRepository
      .createQueryBuilder('groupmember')
      .leftJoinAndSelect('groupmember.group_id', 'group')
      .leftJoinAndSelect('groupmember.user_id', 'user')
      .where('group.group_id = :groupId', { groupId: groupChat.group_id })
      .andWhere('user.user_id = :userId', { userId: user.userId })
      .getOne();
    return foundGroupMember;
  }

  async findGroupMemberByUser(userId: number): Promise<GroupMember[]> {
    const foundGroupMembers = await this.groupMemberRepository
      .createQueryBuilder('groupmember')
      .leftJoinAndSelect('groupmember.user_id', 'user')
      .leftJoinAndSelect('groupmember.group_id', 'group')
      .where('user.user_id = :id', { id: userId })
      .andWhere('groupmember.role = :role', { role: GroupMemberRole.MEMBER })
      .select([
        'groupmember',
        'group',
        'user.userId',
        'user.username',
        'user.avatarUrl',
      ])
      .getMany();
    return foundGroupMembers;
  }

  async findGroupMemberByGroup(groupChat: GroupChat): Promise<GroupMember[]> {
    const foundGroupMembers = await this.groupMemberRepository
      .createQueryBuilder('groupmember')
      .leftJoinAndSelect('groupmember.group_id', 'group')
      .where('group.group_id = :id', { id: groupChat.group_id })
      .getMany();
    return foundGroupMembers;
  }

  async findGroupMemberByGroupId(groupChatId: number): Promise<GroupMember[]> {
    const foundGroupMembers = await this.groupMemberRepository
      .createQueryBuilder('groupmember')
      .leftJoinAndSelect('groupmember.group_id', 'group')
      .leftJoinAndSelect('groupmember.user_id', 'user')
      .where('group.group_id = :id', { id: groupChatId })
      .select([
        'groupmember',
        'group',
        'user.userId',
        'user.username',
        'user.email',
        'user.avatarUrl',
      ])
      .getMany();
    return foundGroupMembers;
  }

  async findGroupMemberById(
    groupMemberId: number,
  ): Promise<GroupMember | null> {
    const foundGroupMember = await this.groupMemberRepository
      .createQueryBuilder('groupmember')
      .leftJoinAndSelect('groupmember.user_id', 'user')
      .leftJoinAndSelect('groupmember.group_id', 'group')
      .where('groupmember.group_member_id = :id', { id: groupMemberId })
      .getOne();
    return foundGroupMember;
  }

  async createNewGroupMember(
    groupChat: GroupChat,
    groupMember: User,
    role: GroupMemberRole,
  ): Promise<GroupMember> {
    const newGroupMember = new GroupMember();
    newGroupMember.group_id = groupChat;
    newGroupMember.user_id = groupMember;
    newGroupMember.role = role;
    newGroupMember.joined_at = new Date();
    const newGroupMemberCreated =
      await this.groupMemberRepository.save(newGroupMember);

    return newGroupMemberCreated;
  }

  async updateGroupMemberRole(groupMemberId: number, newRole: GroupMemberRole) {
    await this.groupMemberRepository
      .createQueryBuilder()
      .update(GroupMember)
      .set({ role: newRole })
      .where('group_member_id = :id', { id: groupMemberId })
      .execute();

    return await this.findGroupMemberById(groupMemberId);
  }

  async deleteGroupMember(groupMember: GroupMember) {
    const deletedResult = await this.groupMemberRepository
      .createQueryBuilder()
      .delete()
      .from(GroupMember)
      .where('group_member_id = :groupMemberId', {
        groupMemberId: groupMember.group_member_id,
      })
      .execute();

    return deletedResult;
  }
}
