import { ConfigModule } from '@nestjs/config';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ['.env.development.local', '.env.production.local'],
});

export default configModule;
