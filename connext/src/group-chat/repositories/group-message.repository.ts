import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMessage } from '../entities/group-message.entity';
import { Repository } from 'typeorm';
import { GroupChat } from '../entities/group-chat.entity';
import { User } from 'src/users/entities/user.entity';
import { INewGroupMessage } from '../interfaces/new-group-message.interface';
import { IGetGroupMessageParams } from '../interfaces/get-group-message.interface';

@Injectable()
export class GroupMessageRepository {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
  ) {}

  async countGroupMessagesByConversation(
    groupChat: GroupChat,
  ): Promise<number> {
    return await this.groupMessageRepository
      .createQueryBuilder('groupmessage')
      .where('groupmessage.group_id = :id', { id: groupChat.group_id })
      .getCount();
  }

  async getGroupMessagesPaginated(
    params: IGetGroupMessageParams,
  ): Promise<GroupMessage[]> {
    return await this.groupMessageRepository
      .createQueryBuilder('groupmessage')
      .leftJoinAndSelect('groupmessage.group_id', 'groupchat')
      .leftJoinAndSelect('groupmessage.sender_id', 'sender')
      .where('groupchat.group_id = :id', {
        id: params.groupChatId,
      })
      .skip(params.offset)
      .take(params.limit)
      .getMany();
  }

  async getGroupMessageByMessageId(messageId: number): Promise<GroupMessage> {
    return await this.groupMessageRepository
      .createQueryBuilder('groupmessage')
      .leftJoinAndSelect('groupmessage.sender_id', 'sender')
      .where('groupmessage.message_id = :id', { id: messageId })
      .select(['sender.userId', 'sender.username', 'sender.avatarUrl'])
      .getOne();
  }

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
    console.log(
      '🚀 ~ GroupMessageRepository ~ newGroupMessageCreated:',
      newGroupMessageCreated,
    );

    return newGroupMessageCreated;
  }
}
