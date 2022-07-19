import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import  * as Joi from "joi"
import { DatabaseModule } from '@app/common/database/database.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/order/.env',
    }),
    DatabaseModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
