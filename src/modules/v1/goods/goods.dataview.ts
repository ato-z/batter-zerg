import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { UserDetailDV } from '@v1/user/user.dataview';

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

class SimpleUserDV {
    @ApiProperty({ description: '用戶id' })
    id: number;

    @ApiProperty({ description: '封面圖' })
    avatar: string;

    @ApiProperty({ description: '昵稱' })
    nickname: string;
}

export class GoodsItemDV {
    @ApiProperty({
        description: '商品id',
    })
    id: number;

    @ApiProperty({
        description: '標題',
    })
    title: string;

    @ApiProperty({
        description: '封面',
    })
    cover: string;

    @ApiProperty({
        description: '留言信息',
    })
    message: string;

    @ApiProperty({
        description: '交換類型 1易物 2免費',
    })
    type: number;

    @ApiProperty({
        description: '商品狀態 0審核中 1上架 2交易中止 3交易成功',
    })
    status: number;

    @ApiProperty({
        description: '創建時間',
    })
    create_date: string;

    @ApiProperty({
        description: '刪除時間',
    })
    delete_date: string | null;

    @ApiProperty({
        description: '標簽',
        isArray: true,
        type: String,
    })
    tags: string[];

    @ApiProperty({
        description: '簡單的用戶信息',
        type: SimpleUserDV,
    })
    user: SimpleUserDV;
}
export class GoodsListResultDV {
    @ApiProperty({
        description: '條目統計',
    })
    total: number;

    @ApiProperty({
        type: GoodsItemDV,
        isArray: true,
    })
    list: GoodsItemDV[];
}

export class GoodsLikesDV {
    @ApiProperty({
        description: '創建時間',
    })
    create_date: string;

    @ApiProperty({
        description: '簡易的用戶信息',
    })
    user: SimpleUserDV;
}

export class GoodsObserveDV {
    @ApiProperty({
        description: '評論id',
    })
    id: number;

    @ApiProperty({
        description: '評論信息',
    })
    content: string;

    @ApiProperty({
        description: '創建時間',
    })
    create_date: string;

    @ApiProperty({
        description: '簡易的用戶信息',
    })
    user: SimpleUserDV;

    @ApiProperty({
        description: '回復對應樓層',
        type: GoodsObserveDV,
    })
    from_user: GoodsObserveDV;
}

export class GoodsDetailDV extends PickType(GoodsItemDV, [
    'id',
    'cover',
    'create_date',
    'delete_date',
    'message',
    'status',
    'tags',
    'title',
    'type',
]) {
    @ApiProperty({
        description: '内容詳情',
    })
    content: string;

    @ApiProperty({
        description: '發佈用戶信息',
        type: UserDetailDV,
    })
    post_user: UserDetailDV;

    @ApiProperty({
        description: '該物品的點贊列表',
        isArray: true,
    })
    likes: GoodsLikesDV;

    @ApiProperty({
        description: '評論列表',
        isArray: true,
    })
    observes: GoodsObserveDV;
}
