import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 模糊搜索用户
   */
  @Get('search')
  async searchUser(@Query() query: { email: string }) {
    const { email } = query;
    if (!email) return [];

    const userList = await this.userService.getUserLikeEmail(email);

    return userList;
  }
}
