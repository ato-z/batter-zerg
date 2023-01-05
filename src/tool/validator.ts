import { GoodsCateModel } from '@database/good.cate.databse';
import { ImageModel } from '@database/image.databser';
import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

/** 檢驗圖像id是否合法 */
const imageModel = new ImageModel();
export const IsImgId = (validationOptions?: ValidationOptions) => {
    return ValidateBy(
        {
            name: 'IsImgID',
            validator: {
                validate: async (id?: number) => {
                    if (id === undefined) return false;
                    return (await imageModel.find(id)) !== null;
                },
                defaultMessage: buildMessage(
                    (eachPrefix) => eachPrefix + '$property 圖像并不存在',
                    validationOptions,
                ),
            },
            async: true,
        },
        validationOptions,
    );
};

/** 檢驗分類pid是否存在 */
const goodsCateModel = new GoodsCateModel();
export const withGoodsCatePid = (validationOptions?: ValidationOptions) => {
    return ValidateBy(
        {
            name: 'withGoodsCatePid',
            validator: {
                validate: async (id: number) => {
                    if (id === 0) return true;
                    const cate = await goodsCateModel.find(id);
                    return cate !== null;
                },
                defaultMessage: buildMessage(
                    (eachPrefix) => eachPrefix + '$property 分类id不存在',
                    validationOptions,
                ),
            },
            async: true,
        },
        validationOptions,
    );
};
