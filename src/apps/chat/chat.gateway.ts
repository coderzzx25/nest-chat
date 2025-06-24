import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../message/message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  private users: Map<string, string> = new Map();
  private userSockets: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    console.log(`连接成功:${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`断开连接:${client.id}`);
    const userId = this.users.get(client.id);
    if (userId) {
      this.users.delete(client.id);
      this.userSockets.delete(userId);
    }
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.users.set(client.id, userId);
    this.userSockets.set(userId, client.id);
    console.log(`用户${userId} 注册成功 ${client.id}`);
  }

  @SubscribeMessage('privateMessage')
  async handlePrivateMessage(
    @MessageBody() data: { recipientId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = this.users.get(client.id);
    if (!senderId) {
      return { error: '未注册' };
    }

    const savedMessage = await this.messageService.createMessage(
      senderId,
      data.recipientId,
      data.content,
    );

    if (!savedMessage) {
      return { error: '发送失败' };
    }

    // 发送消息给接收者
    const recipientSocketId = this.userSockets.get(data.recipientId);
    if (recipientSocketId) {
      savedMessage.status = 'delivered';
      this.server.to(recipientSocketId).emit('privateMessage', savedMessage);

      await this.messageService.markMessagesAsDelivered(
        data.recipientId,
        senderId,
      );
    }

    // 同时发送回发送者（实现消息回显）
    client.emit('privateMessage', savedMessage);

    this.server.to(client.id).emit('updateConversations');
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('updateConversations');
    }

    return { success: true, message: savedMessage };
  }

  @SubscribeMessage('getHistory')
  async handleGetHistory(
    @MessageBody()
    data: {
      otherUserId: string;
      limit?: number;
      before?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.users.get(client.id);
    if (!userId) {
      return { error: '未注册' };
    }

    // 将接收消息标记为已读
    await this.messageService.markMessagesAsRead(userId, data.otherUserId);

    const messages = await this.messageService.getConversation(
      userId,
      data.otherUserId,
    );

    client.emit('messageHistory', {
      withUser: data.otherUserId,
      messages,
    });
  }

  @SubscribeMessage('getConversations')
  async handleGetConversations(@ConnectedSocket() client: Socket) {
    const userId = this.users.get(client.id);
    if (!userId) {
      return { error: '未注册' };
    }

    const conversations =
      await this.messageService.getUserConversations(userId);

    client.emit('conversationList', conversations);
  }
}
