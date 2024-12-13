import { Injectable, BadRequestException } from '@nestjs/common';
import { GroupMessageRepository } from '../repositories/group-message.repository';
import { INewGroupMessage } from '../interfaces/new-group-message.interface';
import { GroupChatRepository } from '../repositories/group-chat.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { SendGroupMessageEventPayload } from 'src/common/types';
import { GroupMessage } from '../entities/group-message.entity';

@Injectable()
export class GroupMessageService {
  constructor(
    private readonly groupMessageRepository: GroupMessageRepository,
    private readonly groupChatRepository: GroupChatRepository,
    private readonly userRepository: UserRepository, 
  ) {}

  async createNewGroupMessage(
    newGroupMessageData: INewGroupMessage,
  ): Promise<SendGroupMessageEventPayload> {

    const groupChat = await this.groupChatRepository.findGroupChatById(newGroupMessageData.groupId);

    if (!groupChat) {
      throw new BadRequestException('Group chat not found');
    }

    const sender = await this.userRepository.findOneById(newGroupMessageData.senderId);

    if (!sender) {
      throw new BadRequestException('Sender not found');
    }

    const newMessage = await this.groupMessageRepository.createNewGroupMessage(
      groupChat, 
      sender,   
      newGroupMessageData,
    );
    
    const response: SendGroupMessageEventPayload = {
      groupMessage: newMessage,  
    };

    return response;
  }
}
