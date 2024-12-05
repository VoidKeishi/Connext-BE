import { Module } from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { GroupChatController } from './group-chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupChat } from './entities/group-chat.entity';
import { GroupMember } from './entities/group-member.entity';
import { GroupMessage } from './entities/group-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupChat, GroupMember, GroupMessage])],
  controllers: [GroupChatController],
  providers: [GroupChatService],
})
export class GroupChatModule {}
