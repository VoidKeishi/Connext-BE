import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MessageRepository } from './repositories/message.repository';
import { ConversationRepository } from 'src/conversation/repositories/conversation.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { INewMessage } from './interfaces/new-message.interface';
import { IGetMessageParams } from './interfaces/get-message.interface';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly userRespository: UserRepository,
  ) {}

  async getMessages(data: IGetMessageParams) {
    const foundConversation =
      await this.conversationRepository.findConversationById(
        data.conversationId,
      );

    if (!foundConversation) {
      throw new NotFoundException('No conversation found!');
    }

    const totalMessages =
      await this.messageRepository.countMessagesByConversation(
        data.conversationId,
      );

    const offset = Math.max(0, totalMessages - data.offset * data.limit);

    const messages = await this.messageRepository.getMessagesPaginated({
      ...data,
      offset,
    });

    return {
      messages,
      total: totalMessages,
      hasMore: offset > 0,
    };
  }

  async createNewMessage(data: INewMessage) {
    const foundConversation =
      await this.conversationRepository.findConversationById(
        data.conversationId,
      );
    if (!foundConversation)
      throw new NotFoundException('No conversation found!');

    const foundRecipient = await this.userRespository.findOneById(
      data.recipientId,
    );
    if (!foundRecipient) throw new NotFoundException('No recipient found!');

    if (data.senderId === data.recipientId)
      throw new BadRequestException('Can not send message to yourself!');

    if (
      !(data.senderId == foundConversation.first_participant_id.userId) &&
      !(data.senderId == foundConversation.second_participant_id.userId)
    ) {
      throw new BadRequestException('Sender ID is not valid');
    }
    if (
      !(data.recipientId == foundConversation.second_participant_id.userId) &&
      !(data.recipientId == foundConversation.first_participant_id.userId)
    ) {
      throw new BadRequestException('Recipient ID is not valid');
    }

    const newMessage = await this.messageRepository.createNewMessage(
      data,
      foundConversation,
    );

    return {
      message: newMessage,
    };
  }
}
