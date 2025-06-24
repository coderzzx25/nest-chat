import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { In, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { formatChatTime } from '../utils/date';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
  ) {}

  async createMessage(senderId: string, recipientId: string, content: string) {
    const response = this.messageRepository.create({
      senderId,
      recipientId,
      content,
    });

    const savedMessage = await this.messageRepository.save(response);

    return savedMessage.selectMessageResponseDto();
  }

  async getConversation(
    user1Id: string,
    user2Id: string,
    before = 20,
    limit = 0,
  ) {
    const response = await this.messageRepository.find({
      where: [
        { senderId: user1Id, recipientId: user2Id },
        { senderId: user2Id, recipientId: user1Id },
      ],
      order: { createTime: 'DESC' },
      take: before,
      skip: limit,
    });

    return response
      .reverse()
      .map((message) => message.selectMessageResponseDto());
  }

  async markMessagesAsDelivered(recipientId: string, senderId: string) {
    await this.messageRepository.update(
      { recipientId, senderId, status: 'sent' },
      { status: 'delivered' },
    );
    return this.messageRepository.find({
      where: { recipientId, senderId, status: 'delivered' },
    });
  }

  async markMessagesAsRead(recipientId: string, senderId: string) {
    await this.messageRepository.update(
      { recipientId, senderId, status: In(['sent', 'delivered']) },
      { status: 'read' },
    );
    return this.messageRepository.find({
      where: { recipientId, senderId, status: 'read' },
    });
  }

  async getUserConversations(userId: string) {
    const conversations = await this.messageRepository.find({
      where: [{ senderId: userId }, { recipientId: userId }],
      select: ['senderId', 'recipientId'],
    });

    const partnerIds = [
      ...new Set(
        conversations.map((conversation) =>
          conversation.senderId === userId
            ? conversation.recipientId
            : conversation.senderId,
        ),
      ),
    ];

    const users = await this.userService.getUserByUuid(partnerIds);

    const conversationData = await Promise.all(
      partnerIds.map(async (partnerId) => {
        const lastMessage = await this.messageRepository.findOne({
          where: [
            { senderId: userId, recipientId: partnerId },
            { senderId: partnerId, recipientId: userId },
          ],
          order: { createTime: 'DESC' },
        });

        const unreadCount = await this.messageRepository.count({
          where: {
            senderId: partnerId,
            recipientId: userId,
            status: In(['sent', 'delivered']),
          },
        });

        return {
          partnerId,
          lastMessage,
          unreadCount,
        };
      }),
    );

    return users.map((user) => {
      const data = conversationData.find((d) => d.partnerId === user.uuid);
      return {
        uuid: user.uuid,
        cnName: user.cnName,
        avatarUrl: user.avatarUrl,
        time: data?.lastMessage?.createTime
          ? formatChatTime(data.lastMessage.createTime)
          : 'No messages',
        unread: data?.unreadCount || 0,
        lastMessage: data?.lastMessage?.content || 'No messages',
      };
    });
  }
}
