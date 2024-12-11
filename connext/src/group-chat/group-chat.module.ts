import { Module } from '@nestjs/common';
import { GroupChatService } from './services/group-chat.service';
import { GroupChatController } from './controllers/group-chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupChat } from './entities/group-chat.entity';
import { GroupMember } from './entities/group-member.entity';
import { GroupMessage } from './entities/group-message.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { GroupChatRepository } from './repositories/group-chat.repository';
import { GroupMemberRepository } from './repositories/group-member.repository';
import { GroupMemberController } from './controllers/group-member.controller';
import { GroupMemberService } from './services/group-member.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([GroupChat, GroupMember, GroupMessage, User]),
  ],
  controllers: [GroupChatController, GroupMemberController],
  providers: [
    GroupChatService,
    GroupMemberService,
    GroupChatRepository,
    GroupMemberRepository,
  ],
})
export class GroupChatModule {}
