import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @Post('login')
  async login(@Body() data: { email: string; password: string }) {
    const { email, password } = data;
    if (!email) throw new HttpException('请输入邮箱', 400);
    if (!password) throw new HttpException('请输入邮箱', 400);

    return this.userService.getUserByEmail(email, password);
  }
}
