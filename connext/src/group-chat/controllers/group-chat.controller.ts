import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { GroupChatService } from '../services/group-chat.service';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateGroupChatDto } from '../dto/create-group-chat.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { GROUP_CHAT_EVENT } from 'src/common/constants/event.constant';
import { UpdateGroupChatDto } from '../dto/update-group-chat.dto';

@Controller('group-chat')
@UseGuards(AuthGuard)
export class GroupChatController {
  constructor(
    private readonly groupChatService: GroupChatService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('new-group-chat')
  async createNewGroupChat(@Body() createGroupChatData: CreateGroupChatDto) {
    // TODO 1: Call groupChatService.createNewGroupChat to creata a new group chat
    // and assign it to a variable
    // TODO 2: Emit an event using eventEmitter.emit(). Pass the result of creating new group chat as payload
    // this.eventEmitter.emit(GROUP_CHAT_EVENT.CREATE_NEW_GROUP_CHAT, payload)
  }

  @Put('rename-group-chat')
  async updateGroupChatName(
    @Body() updateGroupChatNameData: UpdateGroupChatDto,
  ) {
    // TODO 1: Call groupChatService.updateGroupChatName to update group chat name
    // and assign the return data to a variable
    // TODO 2: Emit an event using eventEmitter.emit(). Pass the result of creating new group chat as payload
    // this.eventEmitter.emit(GROUP_CHAT_EVENT.UPDATE_GROUP_CHAT_NAME, payload)
  }
}
