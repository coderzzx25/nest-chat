export class MessageResponseDto {
  id: number;
  senderId: string;
  recipientId: string;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  createTime: string;
  updateTime: string;
}
