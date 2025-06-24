export class UserResponseDto {
  id: number;
  uuid: string;
  email: string;
  cnName: string;
  enName: string;
  age?: number;
  phone?: string;
  avatarUrl?: string;
  sex?: number;
  status: number;
  createTime: string;
  updateTime: string;
}
