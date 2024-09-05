import { Module } from '@nestjs/common';
import { PayController } from './pay.controller';
import { PayService } from './pay.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [PayController],
  providers: [PayService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ]
})
export class PayModule {}
