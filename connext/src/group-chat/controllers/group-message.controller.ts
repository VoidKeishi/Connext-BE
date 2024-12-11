import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { GroupMessageService } from '../services/group-message.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NewGroupMessageDto } from '../dto/new-group-message.dto';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

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
    // TODO 1: Construct the data that has type compatible with INewGroupMessage
    // TODO 2: Create new group message using groupMessageService.createNewGroupMessage
    // TODO 3: Emit an event name GROUP_MESSAGE_EVENT.SEND_GROUP_MESSAGE
    // with the payload is the newly created group message
  }
}
