import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { GroupMemberService } from '../services/group-member.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AddNewMemberDto } from '../dto/add-new-member.dto';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { RemoveMemberDto } from '../dto/remove-member.dto';
import { LeaveGroupDto } from '../dto/leave-group.dto';
import { AddNewMemberEventPayload, RemoveMemberEventPayload, LeaveGroupEventPayload } from 'src/common/types';
import { GROUP_MEMBER_EVENT } from 'src/common/constants/event.constant';

@Controller('group-members')
@UseGuards(AuthGuard)
export class GroupMemberController {
  constructor(
    private readonly groupMemberService: GroupMemberService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('/add-new-members')
  async addNewMembers(
    @Req() request: Request,
    @Body() addNewMembersData: AddNewMemberDto,
  ) {
    const { groupChat, members } = addNewMembersData;
  
    const addNewMembersPayload = {
      groupChat,
      issuer,
      members,
    };
  
    const newMembersData: AddNewMemberEventPayload = await this.groupMemberService.addNewMembers(addNewMembersPayload);
  
    this.eventEmitter.emit(GROUP_MEMBER_EVENT.ADD_NEW_MEMBERS, newMembersData);
  
    return newMembersData;
  }
  

  @Post('/remove-member')
  async removeGroupMember(
    @Req() request: Request,
    @Body() removeMemberData: RemoveMemberDto,
  ) {
    const { groupChatId, groupMemberId } = removeMemberData;
    const issuer = request.user.id;
    const removeMemberPayload = {
      groupChatId,
      issuer,
      groupMemberId,
    };

    const removedMemberData: RemoveMemberEventPayload = await this.groupMemberService.removeGroupMember(removeMemberPayload);

    this.eventEmitter.emit(GROUP_MEMBER_EVENT.REMOVE_MEMBER, removedMemberData);

    return removedMemberData;
  }

  @Post('/leave')
  async leaveGroupChat(
    @Req() request: Request,
    @Body() leaveGroupData: LeaveGroupDto,
  ) {

    const { groupChatId } = leaveGroupData;
    const userId = request.user.id; 

    const leaveGroupPayload = {
      groupChatId,
      userId,
    };

    const leaveGroupDataResponse: LeaveGroupEventPayload = await this.groupMemberService.leaveGroupChat(leaveGroupPayload);
    
    this.eventEmitter.emit(GROUP_MEMBER_EVENT.LEAVE_GROUP, leaveGroupDataResponse);

    return leaveGroupDataResponse;
  }
}
