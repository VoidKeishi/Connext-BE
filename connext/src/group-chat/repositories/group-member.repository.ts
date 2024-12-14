import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupChat } from '../entities/group-chat.entity';
import { Repository, EntityManager } from 'typeorm';
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
    const foundGroupMember = await this.groupMemberRepository.findOne({
      where: { user_id: user, group_id: groupChat },
    });
    return foundGroupMember;
  }

  async findGroupMemberByGroup(groupChat: GroupChat): Promise<GroupMember[]> {
    const foundGroupMembers = await this.groupMemberRepository.find({
      where: { group_id: groupChat },
    });
    return foundGroupMembers;
  }

  async findGroupMemberById(
    groupMemberId: number,
  ): Promise<GroupMember | null> {
    const foundGroupMember = await this.groupMemberRepository.findOne({
      where: { group_member_id: groupMemberId },
      relations: {
        group_id: true,
        user_id: true,
      },
    });
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

    groupChat.groupMembers = [...groupChat.groupMembers, newGroupMemberCreated];
    await this.groupChatRepository.save(groupChat);

    groupMember.groupMembers = [
      ...groupMember.groupMembers,
      newGroupMemberCreated,
    ];
    await this.userRepository.save(groupMember);

    return newGroupMemberCreated;
  }

  async deleteGroupMember(groupMember: GroupMember, groupChat: GroupChat) {
    const deletedResult = await this.groupMemberRepository
      .createQueryBuilder()
      .delete()
      .from(GroupMember)
      .where('group_member_id = :groupMemberId', {
        groupMemberId: groupMember.group_member_id,
      })
      .execute();

    const foundGroupChat = await this.groupChatRepository.findOne({
      where: { group_id: groupChat.group_id },
    });
    foundGroupChat.groupMembers = foundGroupChat.groupMembers.filter(
      (member) => member.group_member_id !== groupMember.group_member_id,
    );
    await this.groupChatRepository.save(foundGroupChat);

    const foundUser = await this.userRepository.findOne({
      where: { userId: groupMember.user_id.userId },
    });
    foundUser.groupMembers = foundUser.groupMembers.filter(
      (member) => member.group_member_id !== groupMember.group_member_id,
    );
    await this.userRepository.save(foundUser);

    return deletedResult;
  }

  async addMemberToGroup(
    groupChat: GroupChat,
    groupMember: User,
    role: GroupMemberRole,
  ): Promise<GroupMember> {
    return await this.groupMemberRepository.manager.transaction(
      async (manager: EntityManager) => {
        const existingMember = await manager.findOne(GroupMember, {
          where: { group_id: groupChat, user_id: groupMember },
        });

        if (existingMember) {
          throw new Error('Already joined');
        }

        const newGroupMember = new GroupMember();
        newGroupMember.group_id = groupChat;
        newGroupMember.user_id = groupMember;
        newGroupMember.role = role;
        newGroupMember.joined_at = new Date();

        const newGroupMemberCreated = await manager.save(newGroupMember);

        const foundGroupChat = await manager.findOne(GroupChat, {
          where: { group_id: groupChat.group_id },
        });
        foundGroupChat.groupMembers = [
          ...foundGroupChat.groupMembers,
          newGroupMemberCreated,
        ];
        await manager.save(foundGroupChat);

        const foundUser = await manager.findOne(User, {
          where: { userId: groupMember.userId },
        });
        foundUser.groupMembers = [
          ...foundUser.groupMembers,
          newGroupMemberCreated,
        ];
        await manager.save(foundUser);

        return newGroupMemberCreated;
      },
    );
  }
}
