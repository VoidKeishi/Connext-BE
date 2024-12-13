import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { GroupMessageService } from '../services/group-message.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NewGroupMessageDto } from '../dto/new-group-message.dto';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { INewGroupMessage } from '../interfaces/new-group-message.interface';
import { SendGroupMessageEventPayload } from 'src/common/types';

@Controller('group-messages')
@UseGuards(AuthGuard)
export class GroupMessageController {
  constructor(
    private readonly groupMessageService: GroupMessageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('/send-message')
  async createNewGroupMessage(
    @Req() request: Request,
    @Body() newGroupMessageData: NewGroupMessageDto,
  ) {

    const newGroupMessage: INewGroupMessage = {
      groupId: newGroupMessageData.groupId,
      senderId: request.user.id,
      content: newGroupMessageData.content,
      mediaUrl: newGroupMessageData.mediaUrl || null, 
      mediaType: newGroupMessageData.mediaType,
    };

    const response = await this.groupMessageService.createNewGroupMessage(newGroupMessage);

    this.eventEmitter.emit('GROUP_MESSAGE_EVENT.SEND_GROUP_MESSAGE', response.groupMessage);

    return response;
  }
}
