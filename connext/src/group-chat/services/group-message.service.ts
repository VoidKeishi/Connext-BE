import { Injectable } from '@nestjs/common';
import { GroupMessageRepository } from '../repositories/group-message.repository';
import { INewGroupMessage } from '../interfaces/new-group-message.interface';
import { GroupChatRepository } from '../repositories/group-chat.repository';
import { SendGroupMessageEventPayload } from 'src/common/types';

@Injectable()
export class GroupMessageService {
  constructor(
    private readonly groupMessageRepository: GroupMessageRepository,
    private readonly groupChatRepository: GroupChatRepository,
  ) {}

  async createNewGroupMessage(
    newGroupMessageData: INewGroupMessage,
  ): Promise<SendGroupMessageEventPayload> {
    // TODO 1: Find group chat by groupId in newGroupMessageData. If not found, throw new BadRequestError
    // TODO 2: Get user by using senderId in newGroupMessageData.
    // TODO 3: Create new group message data by calling groupMessageRepository.createNewGroupMessage
    // TODO 4: Return the data that has type compatible with SendGroupMessageEventPayload
  }
}
