import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { TokenMiddleawre } from '@src/middleware/token.middleware';
import { V1BaseCoontroller } from './base.controller';
import { V1GoodsModule } from './goods';
import { V1MenuModule } from './menu';
import { V1OrderModule } from './order';
import { V1SchoolModule } from './school';
import { V1StaffModule } from './staff';
import { V1UploadModule } from './upload';
import { V1UserModule } from './user';
console.log(V1BaseCoontroller.toPrefix('staff/login'));

@Module({
    imports: [
        V1StaffModule,
        V1UploadModule,
        V1SchoolModule,
        V1MenuModule,
        V1GoodsModule,
        V1UserModule,
        V1OrderModule,
    ],
})
export class V1Module implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        this.inTokenMiddleware(consumer);
    }

    private inTokenMiddleware(consumer: MiddlewareConsumer) {
        consumer
            .apply(TokenMiddleawre)
            .exclude(
                {
                    path: V1BaseCoontroller.toPrefix('staff/login'),
                    method: RequestMethod.POST,
                },
                {
                    path: V1BaseCoontroller.toPrefix('staff/token'),
                    method: RequestMethod.GET,
                },
            )
            .forRoutes(V1BaseCoontroller.toPrefix(''));
    }
}
