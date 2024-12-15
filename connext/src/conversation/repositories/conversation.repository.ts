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
      .leftJoinAndSelect(
        'conversation.first_participant_id',
        'first_participant',
      )
      .leftJoinAndSelect(
        'conversation.second_participant_id',
        'second_participant',
      )
      .select([
        'conversation',
        'first_participant.userId',
        'second_participant.userId',
      ])
      .getOne();

    return foundConversation;
  }

  async getConversations(userId: number): Promise<Conversation[]> {
    const foundConversations = await this.conversationRepostitory
      .createQueryBuilder('conversation')
      .leftJoinAndSelect(
        'conversation.first_participant_id',
        'first_participant',
      )
      .leftJoinAndSelect(
        'conversation.second_participant_id',
        'second_participant',
      )
      .where('first_participant.user_id = :userId', { userId: userId })
      .orWhere('second_participant.user_id = :userId', { userId: userId })
      .select([
        'conversation',
        'first_participant.userId',
        'first_participant.username',
        'first_participant.avatar_url',
        'first_participant.is_online',
        'second_participant.userId',
        'second_participant.username',
        'second_participant.avatar_url',
        'second_participant.is_online',
      ])
      .getMany();

    return foundConversations;
  }

  async createNewConversation(
    firstParticipant: User,
    secondParticipant: User,
  ): Promise<Conversation> {
    const newConversation = new Conversation();
    newConversation.last_message_sent_at = null;
    newConversation.first_participant_id = firstParticipant;
    newConversation.second_participant_id = secondParticipant;
    const newConversationData =
      await this.conversationRepostitory.save(newConversation);

    if (newConversationData.first_participant_id) {
      newConversationData.first_participant_id.passwordHashed = '';
    }
    if (newConversationData.second_participant_id) {
      newConversationData.second_participant_id.passwordHashed = '';
    }
    return newConversationData;
  }
}
