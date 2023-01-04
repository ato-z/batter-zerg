import { ApiProperty } from '@nestjs/swagger';

export class StaffListDV {
    @ApiProperty({
        description: '員工id',
    })
    id: number;

    @ApiProperty({
        description: '用於登錄系統的name',
    })
    name: string;

    @ApiProperty({
        description: '員工昵稱',
    })
    nickname: string;

    @ApiProperty({
        description: '員工頭像',
    })
    cover: string;

    @ApiProperty({
        description: '員工等級',
    })
    level: number;

    @ApiProperty({
        description: '狀態： -1離職 0創建 1正常使用',
    })
    status: -1 | 0 | 1;

    @ApiProperty({
        description: '創建時間',
    })
    create_date: Date;

    @ApiProperty({
        description: '刪除時間，如果存在員工賬號不可用',
        required: false,
    })
    delete_date: Date | null;
}

export class StaffMessageDV {
    @ApiProperty({
        description: '提示信息',
    })
    message: string;
}

class StaffPropItem {
    @ApiProperty()
    title: string;

    @ApiProperty()
    value: number;
}
export class StaffPropDV {
    @ApiProperty({
        description: '員工權限列表',
        isArray: true,
    })
    level: StaffPropItem;

    @ApiProperty({
        description: '員工狀態列表',
        isArray: true,
    })
    status: StaffPropItem;
}

export class StaffDetailDV extends StaffListDV {
    @ApiProperty({
        description: '可切換的配置選項',
    })
    switch: StaffPropDV;
}

export class StaffSignDv {
    @ApiProperty({
        description: '30天有效的sign',
    })
    sign: string;
}

export class StaffTokenDv {
    @ApiProperty({
        description: '2小時有傚的token',
    })
    token: string;
}
