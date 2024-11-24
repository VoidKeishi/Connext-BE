import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';
import { FriendsModule } from './friends/friends.module';
import { GroupChatModule } from './group-chat/group-chat.module';
import { CallsModule } from './calls/calls.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MessagesModule, UsersModule, FriendsModule, GroupChatModule, CallsModule, AuthModule],
})
export class AppModule {}
