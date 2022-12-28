import { Injectable } from '@nestjs/common';

@Injectable()
export class StaffService {
    getHello() {
        return { msg: 'hello world' };
    }
}
