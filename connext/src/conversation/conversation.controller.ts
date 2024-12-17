import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ConversationService } from './conversation.service';
import { GetConversationsDto } from './dto/get-conversations.dto';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  async getUserConversations(
    @Req() request: Request,
    @Query() getConversationsData: GetConversationsDto,
  ) {
    const params = {
      ...getConversationsData,
      userId: request['user'].userId,
    };

    const foundConversations =
      await this.conversationService.getUserConversations(params);
    return foundConversations;
  }
}
