import { Repository } from 'typeorm';
import { Message } from '../entities/messages.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { INewMessage } from '../interfaces/new-message.interface';
import { IGetMessageParams } from '../interfaces/get-message.interface';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async countMessagesByConversation(conversationId: number): Promise<number> {
    return await this.messageRepository
      .createQueryBuilder('message')
      .where('message.conversation_id = :conversationId', { conversationId })
      .getCount();
  }

  async getMessagesPaginated(params: IGetMessageParams): Promise<Message[]> {
    return await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.conversation_id', 'conversation')
      .leftJoinAndSelect('message.sender_id', 'sender')
      .where('conversation.conversation_id = :conversationId', {
        conversationId: params.conversationId,
      })
      .offset(params.offset)
      .limit(params.limit)
      .getMany();
  }

  async createNewMessage(
    data: INewMessage,
    conversation: Conversation,
    sender: User,
  ) {
    const message = new Message();
    message.content = data.content;
    message.media_url = data.mediaUrl;
    message.media_type = data.mediaType;
    message.conversation_id = conversation;
    message.sender_id = sender;
    const newMessage = await this.messageRepository.save(message);

    conversation.last_message = newMessage.content;
    conversation.last_message_sent_at = newMessage.timestamp;
    await this.conversationRepository.save(conversation);

    return newMessage;
  }
}
