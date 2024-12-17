import { Injectable } from '@nestjs/common';
import { ConversationRepository } from './repositories/conversation.repository';
import { IGetConversations } from './interfaces/get-conversations.interface';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async getUserConversations(getConversationsData: IGetConversations) {
    const [conversations, total] =
      await this.conversationRepository.getConversationsPaginated(
        getConversationsData,
      );

    const lastPage = Math.ceil(total / getConversationsData.limit);

    return {
      conversations,
      pagination: {
        total,
        page: getConversationsData.offset,
        lastPage,
        hasMore: getConversationsData.offset < lastPage,
      },
    };
  }
}
