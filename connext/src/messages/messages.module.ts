import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/messages.entity';
import { ConversationModule } from 'src/conversation/conversation.module';
import { UsersModule } from 'src/users/users.module';
import { MessageRepository } from './repositories/message.repository';
import { Conversation } from 'src/conversation/entities/conversation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Conversation]),
    ConversationModule,
    UsersModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessageRepository],
})
export class MessagesModule {}
