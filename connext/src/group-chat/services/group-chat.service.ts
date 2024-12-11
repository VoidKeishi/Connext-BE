import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/repositories/user.repository';
import { GroupChatRepository } from '../repositories/group-chat.repository';
import { GroupMemberRepository } from '../repositories/group-member.repository';
import { INewGroupChat } from '../interfaces/new-group-chat.interface';
import {
  CreateGroupChatEventPayload,
  UpdateGroupChatNameEventPayload,
} from 'src/common/types';
import { IUpdateGroupChatName } from '../interfaces/update-group-chat-name.interface';

@Injectable()
export class GroupChatService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly groupChatRepository: GroupChatRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
  ) {}

  async createNewGroupChat(
    newGroupChatData: INewGroupChat,
  ): Promise<CreateGroupChatEventPayload> {
    // TODO 1: Make a loop that will check if each newGroupChatData.members is existing in Database or not
    // TODO 2: Get the user with id is the same as newGroupChatData.createdBy
    // TODO 3: Create a new groupchat using the groupChatRepository.createNewGroupChat()
    // And then create a new groupmember with that user (the user with id is the same as newGroupChatData.createdBy)
    // Remember to make the role of this user is 'leader'
    // TODO 4: Make a loop that will iterate through each newGroupChatData.members to find user
    // Use that found user, combine with the groupchat that just created to make a new data for groupmember.
    // Remember to make the role of these user are 'user'
    // Return the data that is the same as CreateGroupChatEventPayload
  }

  async updateGroupChatName(
    updateGroupChatNameData: IUpdateGroupChatName,
  ): Promise<UpdateGroupChatNameEventPayload> {
    // TODO 1: Check if the group chat is exist
    // TODO 2: Update the group chat using groupChatRepository.updateGroupChatName()
    // TODO 3: Get all id of members of this group
    // Return the data that is the same as UpdateGroupChatNameEventPayload
  }
}
