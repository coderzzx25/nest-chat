import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageResponseDto } from './dto/message-response.dto';
import { formatChatTime } from '../utils/date';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sender_id', length: 36 })
  senderId: string;

  @Column({ name: 'recipient_id', length: 36 })
  recipientId: string;

  @Column({ name: 'content', charset: 'utf8mb4' })
  content: string;

  @Column({
    type: 'enum',
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
    comment: '消息状态,sent:发送中,delivered:已送达,read:已读',
  })
  status: 'sent' | 'delivered' | 'read';

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

  selectMessageResponseDto(): MessageResponseDto {
    return {
      id: this.id,
      senderId: this.senderId,
      recipientId: this.recipientId,
      content: this.content,
      status: this.status,
      createTime: formatChatTime(this.createTime),
      updateTime: formatChatTime(this.updateTime),
    };
  }
}
