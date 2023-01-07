import { UserAddressModel } from '@database/user.address.database';
import { UserModel } from '@database/user.database';
import { Module } from '@nestjs/common';
import { V1UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    controllers: [V1UserController],
    providers: [UserService, UserModel, UserAddressModel],
})
export class V1UserModule {}
