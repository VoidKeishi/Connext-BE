import { Body, Controller, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { GroupChatService } from '../services/group-chat.service';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateGroupChatDto } from '../dto/create-group-chat.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
    const result = await this.groupChatService.createNewGroupChat(createGroupChatData);
  
    this.eventEmitter.emit(GROUP_CHAT_EVENT.CREATE_NEW_GROUP_CHAT, result);
  
    return result; 
  } 
  

  @Put('rename-group-chat')
  async updateGroupChatName(@Body() updateGroupChatNameData: UpdateGroupChatDto) {

    const result = await this.groupChatService.updateGroupChatName(updateGroupChatNameData);

    this.eventEmitter.emit(GROUP_CHAT_EVENT.UPDATE_GROUP_CHAT_NAME, result);

    return result; 
  }
}
