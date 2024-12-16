import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupChat } from '../entities/group-chat.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class GroupChatRepository {
  constructor(
    @InjectRepository(GroupChat)
    private readonly groupChatRepository: Repository<GroupChat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findGroupChatById(id: number): Promise<GroupChat> {
    const foundGroupChat = await this.groupChatRepository
      .createQueryBuilder('groupchat')
      .leftJoinAndSelect('groupchat.created_by', 'user')
      .where('groupchat.group_id = :groupId', { groupId: id })
      .select([
        'groupchat',
        'user.userId',
        'user.username',
        'user.email',
        'user.avatarUrl',
      ])
      .getOne();
    return foundGroupChat;
  }

  async findUserCreatedGroupChats(userId: number): Promise<GroupChat[]> {
    const foundGroupChats = await this.groupChatRepository
      .createQueryBuilder('groupchat')
      .leftJoinAndSelect('groupchat.created_by', 'user')
      .where('user.user_id = :id', { id: userId })
      .select([
        'groupchat',
        'user.userId',
        'user.username',
        'user.email',
        'user.avatarUrl',
      ])
      .getMany();
    return foundGroupChats;
  }

  async createNewGroupChat(createdBy: User): Promise<GroupChat> {
    const newGroupChat = new GroupChat();
    newGroupChat.created_by = createdBy;
    const newGroupChatCreated =
      await this.groupChatRepository.save(newGroupChat);

    const foundNewGroupChat = await this.findGroupChatById(
      newGroupChatCreated.group_id,
    );

    return foundNewGroupChat;
  }

  async updateGroupChatName(
    groupId: number,
    newGroupName: string,
  ): Promise<GroupChat> {
    await this.groupChatRepository
      .createQueryBuilder('GroupChat')
      .update(GroupChat)
      .set({ group_name: newGroupName })
      .where('group_id = :groupId', { groupId: groupId })
      .execute();

    return await this.findGroupChatById(groupId);
  }
}
