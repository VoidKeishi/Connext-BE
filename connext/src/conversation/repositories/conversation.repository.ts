import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ConversationRepository {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepostitory: Repository<Conversation>,
  ) {}

  async findConversationById(id: number): Promise<Conversation | null> {
    const foundConversation = await this.conversationRepostitory
      .createQueryBuilder('conversation')
      .where('conversation.conversation_id = :id', { id })
      .leftJoinAndSelect('conversation.sender_id', 'sender')
      .leftJoinAndSelect('conversation.recipient_id', 'recipient')
      .select(['conversation', 'sender.userId', 'recipient.userId'])
      .getOne();

    return foundConversation;
  }

  async getConversations(userId: number): Promise<Conversation[]> {
    const foundConversations = await this.conversationRepostitory
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.sender_id', 'sender')
      .leftJoinAndSelect('conversation.recipient_id', 'recipient')
      .where('sender.user_id = :userId', { userId: userId })
      .select([
        'conversation',
        'sender.userId',
        'sender.username',
        'sender.avatar_url',
        'sender.is_online',
        'recipient.userId',
        'recipient.username',
        'recipient.avatar_url',
        'recipient.is_online',
      ])
      .getMany();

    return foundConversations;
  }

  async createNewConversation(
    sender: User,
    recipient: User,
  ): Promise<Conversation> {
    const newConversation = new Conversation();
    newConversation.last_message_sent_at = null;
    newConversation.sender_id = sender;
    newConversation.recipient_id = recipient;
    const newConversationData =
      await this.conversationRepostitory.save(newConversation);

    sender.senders = [...sender.senders, newConversationData];
    sender.recipients = [...sender.recipients, newConversation];

    recipient.senders = [...recipient.senders, newConversation];
    recipient.recipients = [...recipient.recipients, newConversation];

    return newConversationData;
  }
}
