import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';
import { FriendsModule } from './friends/friends.module';
import { GroupChatModule } from './group-chat/group-chat.module';
import { CallsModule } from './calls/calls.module';

@Module({
  imports: [MessagesModule, UsersModule, FriendsModule, GroupChatModule, CallsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
