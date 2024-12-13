import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
}
