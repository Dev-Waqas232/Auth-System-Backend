import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Record<any, any> {
    return { message: 'Hello World' };
  }
}
