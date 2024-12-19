import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { Roles } from 'src/auth/roles-decorator';
import { Role } from 'src/common/enum/role-enum';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { GetUserPaginatedDto } from './dto/get-user-paginated.dto';

@Controller('dashboard')
@UseGuards(AuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles(Role.Admin)
  @Get('total-users')
  async getTotalUsers(@Req() request: Request) {
    return this.dashboardService.getTotalUsers(request['user'].userId);
  }

  @Roles(Role.Admin)
  @Get('online-users')
  async getTotalOnlineUsers() {
    return this.dashboardService.getTotalOnlineUsers();
  }

  @Roles(Role.Admin)
  @Get('users-per-month')
  async getUsersPerMonth() {
    return this.dashboardService.getTotalUserPerMonth();
  }

  // dashboard.controller.ts
  @Roles(Role.Admin)
  @Get('users')
  async getUserPaginated(@Query() getUserPaginatedData: GetUserPaginatedDto) {
    return this.dashboardService.getUserPaginated(
      getUserPaginatedData.limit,
      getUserPaginatedData.offset,
      getUserPaginatedData.status,
    );
  }
}
