import { Repository } from 'typeorm';
import { Message } from '../entities/messages.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { NewMessageDto } from '../dto/new-message.dto';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async createNewMessage(data: NewMessageDto, conversation: Conversation) {
    const message = new Message();
    message.content = data.content;
    message.media_url = data.media_url;
    message.media_type = data.media_type;
    message.conversation_id = conversation;
    const newMessage = await this.messageRepository.save(message);

    conversation.last_message = newMessage.content;
    conversation.last_message_sent_at = newMessage.timestamp;
    await this.conversationRepository.save(conversation);

    return newMessage;
  }
}
