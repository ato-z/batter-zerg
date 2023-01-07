import { ApiProperty } from '@nestjs/swagger';
import { SchoolItemDV } from '@v1/school/school.dataview';
import { UserAddressDV } from './user.address.dataview';

export class UserDetailDV {
    @ApiProperty({
        description: '用戶id',
    })
    id: number;

    @ApiProperty({
        description: '小程序openid',
    })
    open_id: string;

    @ApiProperty({
        description: '微信的唯一id，可能為空',
    })
    union_id: string;

    @ApiProperty({
        description: '用戶昵稱',
    })
    nickname: string;

    @ApiProperty({
        description: '用戶封面',
    })
    avatar: string;

    @ApiProperty({
        description: '性別 0未知 1男 2女',
    })
    gender: number;

    @ApiProperty({
        description: '省份',
    })
    province: string;

    @ApiProperty({
        description: '城市',
    })
    city: string;

    @ApiProperty({
        description: '區域',
    })
    country: string;

    @ApiProperty({
        description: '手機號',
    })
    mobile: string;

    @ApiProperty({
        description: '創建時間',
    })
    create_date: string;

    @ApiProperty({
        description: '學院信息',
    })
    school: SchoolItemDV;
}

export class SimpleUserDV {
    @ApiProperty({ description: '用戶id' })
    id: number;

    @ApiProperty({ description: '封面圖' })
    avatar: string;

    @ApiProperty({ description: '昵稱' })
    nickname: string;
}

export class WithUserDV {
    @ApiProperty({
        description: '用户id',
    })
    id: number;

    @ApiProperty({
        description: '微信用户open_id',
    })
    open_id: string;

    @ApiProperty({
        description: '微信用户union_id',
    })
    union_id: string | null;

    @ApiProperty({
        description: '学院id',
    })
    schools_id: string | null;

    @ApiProperty({
        description: '用户昵称',
    })
    nickname: string | null;

    @ApiProperty({
        description: '封面',
    })
    avatar: string | null;

    @ApiProperty({
        description: '性别',
    })
    gender: number;

    @ApiProperty({
        description: '城市',
    })
    city: string | null;

    @ApiProperty({
        description: '省',
    })
    province: string | null;

    @ApiProperty({
        description: '区域',
    })
    country: string | null;

    @ApiProperty({
        description: '手机号',
    })
    mobile: string | null;

    @ApiProperty({
        description: '创建时间',
    })
    create_date: string;
}

export class UserFullDV extends WithUserDV {
    @ApiProperty({
        description: '学院信息',
        type: SchoolItemDV,
    })
    school: SchoolItemDV;

    @ApiProperty({
        description: '用户的联系地址',
        type: UserAddressDV,
        isArray: true,
    })
    address: UserAddressDV[];
}
