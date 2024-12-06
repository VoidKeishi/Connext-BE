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
    const foundConversation = await this.conversationRepostitory.findOneBy({
      conversation_id: id,
    });
    return foundConversation;
  }
}
