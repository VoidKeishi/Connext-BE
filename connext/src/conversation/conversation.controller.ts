import { Controller, Get, Req } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationRepository } from './repositories/conversation.repository';
import { Request } from 'express';
import { Conversation } from './entities/conversation.entity';

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  @Get()
  async getUserConversations(@Req() request: Request): Promise<Conversation[]> {
    const foundConversations =
      await this.conversationRepository.getConversations(
        request['user'].userId,
      );
    return foundConversations;
  }
}
