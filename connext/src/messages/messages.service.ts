import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MessageRepository } from './repositories/message.repository';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConversationRepository } from 'src/conversation/repositories/conversation.repository';
import { UserRepository } from 'src/users/repositories/user.repository';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly userRespository: UserRepository,
  ) {}

  async createNewMessage(data: CreateMessageDto) {
    // Find conversation
    const foundConversation =
      await this.conversationRepository.findConversationById(
        data.conversation_id,
      );
    if (!foundConversation)
      throw new NotFoundException('No conversation found!');

    // Find recipient
    const foundRecipient = await this.userRespository.findOneById(
      foundConversation.recipient_id,
    );
    if (!foundRecipient) throw new NotFoundException('No recipient found!');

    // Check if sender_id and recipient_id that client sent
    // is the same as the conversation sender_id and recipient_id
    const { sender_id, recipient_id } = data;
    if (sender_id !== foundConversation.sender_id) {
      throw new BadRequestException('Sender ID is not valid');
    }
    if (recipient_id !== foundConversation.recipient_id) {
      throw new BadRequestException('Recipient ID is not valid');
    }

    // Save new message
    const message = {
      conversation_id: foundConversation.conversation_id,
      content: data.content,
      media_url: data.media_url,
      media_type: data.media_type,
    };
    const newMessage = await this.messageRepository.createNewMessage(
      message,
      foundConversation,
    );
    return {
      message: newMessage,
      conversation: foundConversation,
    };
  }
}
