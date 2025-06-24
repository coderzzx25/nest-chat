import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { UserResponseDto } from './dto/user-response.dto';
import { timestampToDate } from '../utils/date';

@Entity({ name: 'users', comment: '用户表' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', comment: '用户ID' })
  id: number;

  @Column({
    name: 'uuid',
    type: 'varchar',
    length: 36,
    unique: true,
    comment: '用户UUID',
  })
  uuid: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 50,
    default: '',
    comment: '邮箱',
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 200,
    default: '',
    comment: '加密后密码',
  })
  password: string;

  @Column({
    name: 'cn_name',
    type: 'varchar',
    length: 50,
    default: '',
    comment: '中文名',
  })
  cnName: string;

  @Column({
    name: 'en_name',
    type: 'varchar',
    length: 50,
    default: '',
    comment: '英文名',
  })
  enName: string;

  @Column({ name: 'age', type: 'int', default: 0, comment: '年龄' })
  age: number;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 50,
    default: '',
    comment: '电话号码',
  })
  phone: string;

  @Column({
    name: 'avatar_url',
    type: 'varchar',
    length: 200,
    default: '',
    comment: '用户头像',
  })
  avatarUrl: string;

  @Column({ name: 'sex', type: 'int', default: 1, comment: '性别' })
  sex: number;

  @Column({ name: 'status', type: 'int', default: 1, comment: '用户状态' })
  status: number;

  @Column({
    name: 'create_time',
    type: 'int',
    comment: '创建时间',
  })
  createTime: number;

  @Column({
    name: 'update_time',
    type: 'int',
    comment: '更新时间',
  })
  updateTime: number;

  @BeforeInsert()
  updateTimestampsOnInsert() {
    const timestamp = Math.floor(Date.now() / 1000);
    this.createTime = timestamp;
    this.updateTime = timestamp;
  }

  @BeforeUpdate()
  updateTimestampsOnUpdate() {
    this.updateTime = Math.floor(Date.now() / 1000);
  }

  selectUserResponseDto(): UserResponseDto {
    return {
      id: this.id,
      uuid: this.uuid,
      email: this.email,
      cnName: this.cnName,
      enName: this.enName,
      age: this.age,
      phone: this.phone,
      avatarUrl: this.avatarUrl,
      sex: this.sex,
      status: this.status,
      createTime: timestampToDate(this.createTime),
      updateTime: timestampToDate(this.updateTime),
    };
  }
}
