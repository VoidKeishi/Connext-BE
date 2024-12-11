import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { GroupMemberService } from '../services/group-member.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AddNewMemberDto } from '../dto/add-new-member.dto';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { RemoveMemberDto } from '../dto/remove-member.dto';
import { LeaveGroupDto } from '../dto/leave-group.dto';

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
    // TODO 1: Create a new data that has the same type as IAddNewMembers
    // TODO 2: Call groupMemberService.addNewMembers(). Save the returned data.
    // TODO 3: Emit an event called GROUP_MEMBER_EVENT.ADD_NEW_MEMBERS
  }

  @Post('/remove-member')
  async removeGroupMember(
    @Req() request: Request,
    @Body() removeMemberData: RemoveMemberDto,
  ) {
    // TODO 1: Create a new data that has the same type as IRemoveMember
    // TODO 2: Call groupMemberService.removeGroupMember(). Save the returned data.
    // TODO 3: Emit an event called GROUP_MEMBER_EVENT.REMOVE_MEMBER
  }

  @Post('/leave')
  async leaveGroupChat(
    @Req() request: Request,
    @Body() leaveGroupData: LeaveGroupDto,
  ) {
    // TODO 1: Create a new data that has the same type as ILeaveGroup
    // TODO 2: Call groupMemberService.leaveGroupChat(). Save the returned data.
    // TODO 3: Emit an event called GROUP_MEMBER_EVENT.LEAVE_GROUP
  }
}
