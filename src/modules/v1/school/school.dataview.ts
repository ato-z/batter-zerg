import { ApiProperty } from '@nestjs/swagger';

export class SchoolItemDV {
    @ApiProperty({
        description: '學校id',
    })
    id: number;

    @ApiProperty({
        description: '學校名稱，唯一',
    })
    name: string;

    @ApiProperty({
        description: '經度',
    })
    latitude: string;

    @ApiProperty({
        description: '緯度',
    })
    longitude: string;

    @ApiProperty({
        description: '創建時間',
    })
    create_date: string;
}

export class SchoolMessageDV {
    @ApiProperty({
        description: '提示信息',
    })
    message: string;
}
