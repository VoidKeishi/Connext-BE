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
    // Find conversation
    const foundConversation =
      await this.conversationRepository.findConversationById(
        data.conversationId,
      );
    if (!foundConversation)
      throw new NotFoundException('No conversation found!');

    // Find recipient
    const foundRecipient = await this.userRespository.findOneById(
      data.recipientId,
    );
    if (!foundRecipient) throw new NotFoundException('No recipient found!');

    // Check if sender_id and recipient_id that client sent
    // is the same as the conversation sender_id and recipient_id
    if (data.senderId !== foundConversation.sender_id.userId) {
      throw new BadRequestException('Sender ID is not valid');
    }
    if (data.recipientId !== foundConversation.recipient_id.userId) {
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
