import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class ConfigUpdateDTO {
    @ApiProperty({
        // 0输入框 1switch切換 2文本域 3下拉菜单 4圖片上傳
        description:
            '[type0: 字符串] [type1: 0|1] [type2: 字符串] [type3: 選擇菜單下標] [type4: 圖片id]',
        type: String,
    })
    @IsNotEmpty()
    value: any;

    @ApiProperty({
        description: '排序，數字越大排越前',
    })
    @IsOptional()
    @IsInt()
    order: number;
}
