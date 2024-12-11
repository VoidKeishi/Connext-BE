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
}
