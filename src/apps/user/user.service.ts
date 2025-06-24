import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { In, Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(data: CreateUserDto) {
    data.password = await this.hashPassword(data.password);
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async getUserByEmail(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new HttpException('用户不存在', 400);
    if (!(await this.validatePassword(password, user.password)))
      throw new HttpException('密码错误', 400);

    return user.selectUserResponseDto();
  }

  async getUserLikeEmail(email: string) {
    return this.userRepository.find({
      where: {
        email: Like(`%${email}%`),
      },
    });
  }

  async getUserByUuid(uuid: string[]) {
    return this.userRepository.find({
      where: { uuid: In(uuid) },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // 加密强度
    return await bcrypt.hash(password, saltRounds);
  }

  private async validatePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
