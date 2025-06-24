import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './apps/chat/chat.module';
import { MessageModule } from './apps/message/message.module';
import { UserModule } from './apps/user/user.module';
import { AuthModule } from './apps/auth/auth.module';
import configModule from './libs/config.module';
import typeormModule from './libs/typeorm.module';

@Module({
  imports: [
    configModule,
    typeormModule,
    ChatModule,
    MessageModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
