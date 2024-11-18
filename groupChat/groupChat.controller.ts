import { Controller, Post, Body, Patch, Delete } from '@nestjs/common';

import { GroupChatService } from './groupChat.service';
import { GroupChat } from './groupChat.entity';

@Controller('groupChat')
export class GroupChatController {
  constructor(private readonly groupChatService: GroupChatService) {}

  @Post('register')
  async groupChatRegister(
      @Body('groupName') groupName: string,
      @Body('userId') userId: number,
  ) {
    return this.groupChatService.groupRegister(groupName, userId);
  }

  @Patch('update-group-chat-info')
  async changeInfo(
      @Body()
          body: {
        groupName?: string;
      },
  ): Promise<GroupChat> {
    const { groupName } = body;
    return this.groupChatService.updateGroupChat(groupName);
  }

  @Delete('update-group')
  async deleteAccount(
      @Body()
          body: {
        groupName?: string;
      },
  ): Promise<string> {
    const { groupName } = body;
    await this.groupChatService.deleteGroupChat(groupName);
    return 'delete success';
  }
}
