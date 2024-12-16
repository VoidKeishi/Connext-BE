import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { GroupMessageRepository } from '../repositories/group-message.repository';
import { INewGroupMessage } from '../interfaces/new-group-message.interface';
import { GroupChatRepository } from '../repositories/group-chat.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { SendGroupMessageEventPayload } from 'src/common/types';
import { IGetGroupMessageParams } from '../interfaces/get-group-message.interface';
import { GroupMemberRepository } from '../repositories/group-member.repository';

@Injectable()
export class GroupMessageService {
  constructor(
    private readonly groupMessageRepository: GroupMessageRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
    private readonly groupChatRepository: GroupChatRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getGroupMessages(data: IGetGroupMessageParams) {
    const foundGroupChat = await this.groupChatRepository.findGroupChatById(
      data.groupChatId,
    );
    if (!foundGroupChat) {
      throw new NotFoundException('No group chat found!');
    }

    const totalMessages =
      await this.groupMessageRepository.countGroupMessagesByConversation(
        foundGroupChat,
      );

    const offset = Math.max(0, totalMessages - data.offset * data.limit);

    const messages =
      await this.groupMessageRepository.getGroupMessagesPaginated({
        ...data,
        offset,
      });

    return {
      messages,
      total: totalMessages,
      hasMore: offset > 0,
    };
  }

  async createNewGroupMessage(
    newGroupMessageData: INewGroupMessage,
  ): Promise<SendGroupMessageEventPayload> {
    const groupChat = await this.groupChatRepository.findGroupChatById(
      newGroupMessageData.groupId,
    );
    if (!groupChat) {
      throw new BadRequestException('Group chat not found');
    }

    const sender = await this.userRepository.findOneById(
      newGroupMessageData.senderId,
    );
    if (!sender) {
      throw new BadRequestException('User not found');
    }

    const isGroupMember =
      await this.groupMemberRepository.findGroupMemberByGroupId(
        groupChat.group_id,
      );
    if (!isGroupMember)
      throw new BadRequestException('Sender is not a group member!');

    const newMessage = await this.groupMessageRepository.createNewGroupMessage(
      groupChat,
      sender,
      newGroupMessageData,
    );

    return {
      groupMessage: newMessage,
    };
  }
}
