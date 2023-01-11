import { MenuLevelModel } from '@database/menu.level.database';
import { StaffModel } from '@database/staff.database';
import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { TokenMiddleawre } from '@src/middleware/token.middleware';
import { VerifyStaffLevel } from '@src/middleware/verify.staff.level.middleawre';
import { TokenService } from '../token.service';
import { V1BaseCoontroller } from './base.controller';
import { V1ConfigModule } from './config';
import { V1GoodsModule } from './goods';
import { V1MenuModule } from './menu';
import { V1OrderModule } from './order';
import { V1SchoolModule } from './school';
import { V1StaffModule } from './staff';
import { V1UploadModule } from './upload';
import { V1UserModule } from './user';

@Module({
    imports: [
        V1StaffModule,
        V1UploadModule,
        V1SchoolModule,
        V1MenuModule,
        V1GoodsModule,
        V1UserModule,
        V1OrderModule,
        V1ConfigModule,
    ],
    providers: [MenuLevelModel, StaffModel, TokenService],
})
export class V1Module implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        this.inTokenMiddleware(consumer);
        this.inVerifyStaffLevelMiddleware(consumer);
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
                {
                    path: V1BaseCoontroller.toPrefix(
                        'upload/callback/qiniu_image',
                    ),
                    method: RequestMethod.ALL,
                },
                {
                    path: V1BaseCoontroller.toPrefix('config/os'),
                    method: RequestMethod.GET,
                },
            )
            .forRoutes(V1BaseCoontroller.toPrefix(''));
    }

    private inVerifyStaffLevelMiddleware(consumer: MiddlewareConsumer) {
        consumer
            .apply(VerifyStaffLevel)
            .forRoutes(V1BaseCoontroller.toPrefix(''));
    }
}
