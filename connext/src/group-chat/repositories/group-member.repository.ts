import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupChat } from '../entities/group-chat.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { GroupMember } from '../entities/group-member.entity';

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
  ) : Promise<GroupMember | null> {
    const foundGroupMember = await this.groupMemberRepository.findOne({
      where: { user_id: user, group_id: groupChat },
    })
    return foundGroupMember;
  }

  async findGroupMemberById(groupMemberId): Promise<GroupMember | null> {
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
    role: 'user' | 'leader',
  ): Promise<GroupMember> {
    const newGroupMember = new GroupMember();
    newGroupMember.group_id = groupChat;
    newGroupMember.user_id = groupMember;
    newGroupMember.role = role;
    newGroupMember.joined_at = new Date();
    const newGroupMemberCreated =
      await this.groupMemberRepository.save(newGroupMember);

    const foundGroupChat = await this.groupChatRepository.findOne({
      where: { group_id: groupChat.group_id },
    });
    foundGroupChat.groupMembers = [
      ...foundGroupChat.groupMembers,
      newGroupMemberCreated,
    ];
    await this.groupChatRepository.save(foundGroupChat);

    const foundUser = await this.userRepository.findOne({
      where: { userId: groupMember.userId },
    });
    foundUser.groupMembers = [...foundUser.groupMembers, newGroupMemberCreated];
    await this.userRepository.save(foundUser);

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
    );;
    await this.userRepository.save(foundUser);

    return deletedResult;
  }
}
