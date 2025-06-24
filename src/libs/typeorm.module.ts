import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

const typeormModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql', // 数据库类型
    host: configService.get<string>('NEST_MYSQL_HOST'), // 数据库地址
    port: configService.get<number>('NEST_MYSQL_PORT'), // 数据库端口
    username: configService.get<string>('NEST_MYSQL_USER'), // 数据库用户名
    password: configService.get<string>('NEST_MYSQL_PASSWORD'), // 数据库密码
    database: configService.get<string>('NEST_MYSQL_DATABASE'), // 数据库名称
    charset: configService.get<string>('NEST_MYSQL_CHARSET'), // 数据库编码
    timezone: configService.get<string>('NEST_MYSQL_TIMEZONE'), // 时区
    entities: [__dirname + '/../**/*.entity{.ts,.js}'], // 实体文件路径
    synchronize: configService.get<boolean>('NEST_MYSQL_SYNCHRONIZE'), // 是否自动同步数据库表结构
  }),
  inject: [ConfigService],
});
export default typeormModule;
