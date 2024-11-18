import { GroupChat } from './groupChat.entity';
import { User } from '../login/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GroupChatService {
  constructor(
    @InjectRepository(GroupChat)
    private readonly groupChatRepository: Repository<GroupChat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async groupRegister(groupName: string, userId: number): Promise<GroupChat> {
    const groupChat = this.groupChatRepository.create({
      groupName,
      createdAt: new Date(),
      createdBy: { id: userId } as any,
    });
    return await this.groupChatRepository.save(groupChat);
  }

  async deleteGroupChat(groupName: string): Promise<GroupChat | null> {
    const groupChat = await this.groupChatRepository.findOne({
      where: { groupName },
    });
    await this.groupChatRepository.remove(groupChat);
    return null;
  }

  async updateGroupChat(groupName: string): Promise<GroupChat | null> {
    const groupChat = await this.groupChatRepository.findOne({
      where: { groupName },
    });

    groupChat.groupName = groupName;
    return await this.groupChatRepository.save(groupChat);
  }
}
