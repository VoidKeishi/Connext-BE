import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ConversationRepository } from './repositories/conversation.repository';
import { Request } from 'express';
import { Conversation } from './entities/conversation.entity';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationController {
  constructor(
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
