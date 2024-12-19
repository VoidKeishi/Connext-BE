import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroupChatService } from '../services/group-chat.service';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateGroupChatDto } from '../dto/create-group-chat.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GROUP_CHAT_EVENT } from 'src/common/constants/event.constant';
import { UpdateGroupChatDto } from '../dto/update-group-chat.dto';
import { Request } from 'express';

@Controller('group-chats')
@UseGuards(AuthGuard)
export class GroupChatController {
  constructor(
    private readonly groupChatService: GroupChatService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get()
  async getUserGroupChats(@Req() request: Request) {
    const foundGroupChats = await this.groupChatService.getUserGroupChats(
      request['user'].userId,
    );
    return foundGroupChats;
  }

  @Get(':groupChatId')
  async getGroupChatDetail(@Param('groupChatId') groupChatId: string) {
    const foundGroupChat =
      await this.groupChatService.getGroupChatDetail(+groupChatId);
    return foundGroupChat;
  }

  // /api/group-chats/new
  @Post('new')
  async createNewGroupChat(
    @Req() request: Request,
    @Body() createGroupChatData: CreateGroupChatDto,
  ) {
    const newGroupChatData = {
      createdBy: request['user'].userId,
      members: [...createGroupChatData.members],
    };
    const result =
      await this.groupChatService.createNewGroupChat(newGroupChatData);
    this.eventEmitter.emit(GROUP_CHAT_EVENT.CREATE_NEW_GROUP_CHAT, result);
    return result;
  }

  @Put('rename-group-chat')
  async updateGroupChatName(
    @Body() updateGroupChatNameData: UpdateGroupChatDto,
  ) {
    const result = await this.groupChatService.updateGroupChatName(
      updateGroupChatNameData,
    );
    this.eventEmitter.emit(GROUP_CHAT_EVENT.UPDATE_GROUP_CHAT_NAME, result);
    return result;
  }
}
