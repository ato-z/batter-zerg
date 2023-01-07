import { ApiProperty } from '@nestjs/swagger';
import { SchoolItemDV } from '@v1/school/school.dataview';

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
