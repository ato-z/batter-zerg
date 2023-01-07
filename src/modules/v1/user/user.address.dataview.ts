import { ApiProperty } from '@nestjs/swagger';

export class UserAddressDV {
    @ApiProperty({
        description: '地址id',
    })
    id: number;

    @ApiProperty({
        description: '用户id',
    })
    uid: number;

    @ApiProperty({
        description: '联系人昵称',
    })
    nickname: string;

    @ApiProperty({
        description: '省',
    })
    province: string;

    @ApiProperty({
        description: '城市',
    })
    city: string;

    @ApiProperty({
        description: '区域',
    })
    country: string;

    @ApiProperty({
        description: '详情地址',
    })
    detail: string;

    @ApiProperty({
        description: '手机号',
    })
    mobile: string;

    @ApiProperty({
        description: '微信号',
    })
    wechat: string;

    @ApiProperty({
        description: '维度',
    })
    longitude: string;

    @ApiProperty({
        description: '经度',
    })
    latitude: string;

    @ApiProperty({
        description: '创建时间',
    })
    create_date: string;

    @ApiProperty({
        description: '删除时间',
    })
    delete_date: string | null;
}
