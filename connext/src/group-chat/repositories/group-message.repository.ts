import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMessage } from '../entities/group-message.entity';
import { Repository } from 'typeorm';
import { GroupChat } from '../entities/group-chat.entity';
import { User } from 'src/users/entities/user.entity';
import { INewGroupMessage } from '../interfaces/new-group-message.interface';

@Injectable()
export class GroupMessageRepository {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
    @InjectRepository(GroupChat)
    private readonly groupChatRepository: Repository<GroupChat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createNewGroupMessage(
    groupChat: GroupChat,
    sender: User,
    groupMessageData: INewGroupMessage,
  ): Promise<GroupMessage> {
    const newGroupMessage = new GroupMessage();
    newGroupMessage.group_id = groupChat;
    newGroupMessage.sender_id = sender;
    newGroupMessage.content = groupMessageData.content;
    newGroupMessage.media_type = groupMessageData.mediaType;
    newGroupMessage.media_url = groupMessageData.mediaUrl;
    newGroupMessage.timestamp = new Date();
    const newGroupMessageCreated =
      await this.groupMessageRepository.save(newGroupMessage);

    groupChat.groupMessages = [
      ...groupChat.groupMessages,
      newGroupMessageCreated,
    ];
    await this.groupChatRepository.save(groupChat);

    sender.groupMessages = [...sender.groupMessages, newGroupMessageCreated];
    await this.userRepository.save(sender);

    return newGroupMessageCreated;
  }
}
