import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE } from './constants/service';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly ordersRepository: OrderRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy
  ){}

  async createOrder(request: CreateOrderRequest, authentication: string){
    const session = await this.ordersRepository.startTransaction();
    try {
      const order = await this.ordersRepository.create(request, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
          Authentication: authentication,
        }),
      );
      await session.commitTransaction();
      return order;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  async getOrders(){
    return this.ordersRepository.find({});
  }
}
