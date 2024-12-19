import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { FriendsModule } from './friends/friends.module';
import { GroupChatModule } from './group-chat/group-chat.module';
import { CallsModule } from './calls/calls.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { GatewaysModule } from './gateways/gateways.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConversationModule } from './conversation/conversation.module';
import { UploadsModule } from './uploads/uploads.module';
import { AppController } from './app.controller';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PGHOST'),
        port: configService.get('PGPORT'),
        username: configService.get('PGUSER'),
        password: configService.get('PGPASSWORD'),
        database: configService.get('PGDATABASE'),
        autoLoadEntities: true,
        synchronize: true, // Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
        extra: {
          ssl: true,
        },
        retryAttempts: 20,
        retryDelay: 3000,
      }),
      inject: [ConfigService],
    }),
    MessagesModule,
    FriendsModule,
    GroupChatModule,
    CallsModule,
    AuthModule,
    UsersModule,
    GatewaysModule,
    ConversationModule,
    UploadsModule,
    DashboardModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
