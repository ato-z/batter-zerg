import { ApiProperty, OmitType } from '@nestjs/swagger';

export class GoodsMessageDV {
    @ApiProperty({
        description: '提示信息',
    })
    message: string;
}

export class GoodsCateDetailDV {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    pic: string;

    @ApiProperty()
    pid: number;

    @ApiProperty({
        type: OmitType(GoodsCateDetailDV, ['parent_cate']),
    })
    parent_cate: GoodsCateDetailDV;

    @ApiProperty()
    order: number;

    @ApiProperty()
    create_date: string;

    @ApiProperty()
    delete_date: string;
}

export class GoodsCateListDV {
    @ApiProperty({
        type: OmitType(GoodsCateDetailDV, ['parent_cate']),
        isArray: true,
    })
    list: GoodsCateDetailDV[];

    @ApiProperty()
    total: number;
}
