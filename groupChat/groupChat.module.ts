import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupChat } from './groupChat.entity';
import { GroupChatController } from './groupChat.controller';
import { GroupChatService } from './groupChat.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupChat])],
  controllers: [GroupChatController],
  providers: [GroupChatService],
})
export class GroupChatModule {}
