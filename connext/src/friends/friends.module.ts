import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from './entities/friendship.entity';
import { ConversationModule } from 'src/conversation/conversation.module';
import { UsersModule } from 'src/users/users.module';
import { FriendshipRepository } from './repositories/friendship.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friendship]),
    ConversationModule,
    UsersModule,
  ],
  controllers: [FriendsController],
  providers: [FriendsService, FriendshipRepository],
})
export class FriendsModule {}
