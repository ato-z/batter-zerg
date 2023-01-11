import { appConfig } from '@config/app';
import { staticConfig } from '@config/static';
import { ImageModel, type ImageBase } from '@database/image.databser';
import { Injectable } from '@nestjs/common';
import { ApiException } from '@src/exceptions';
import { fillZero, getImageAttr, touchPath } from '@src/tool';
import * as sha1 from 'sha1';
import { join as pathJoin } from 'path';
import { writeFileSync } from 'fs';
import { ImageFrom } from '@src/enum';
import { OP } from 'mysql-crud-core/enum';

export type imageFile = {
    fieldname: string;
    originalname: string;
    mimetype: 'image/jpg' | 'image/jpeg' | 'image/png' | 'image/gif';
    buffer: Buffer;
    size: number;
};

@Injectable()
export class ImageService {
    constructor(private readonly imageModel: ImageModel) {}

    /**
     * 儅圖像上傳到七牛雲時，更新from值
     */
    async saveFrom(id: number, from: ImageFrom) {
        await this.imageModel.update(
            { from },
            {
                where: { and: { id } },
            },
        );
    }

    /**
     * 上传至本地
     */
    async uploadToLocal(img: imageFile) {
        // 校验文件是否合法
        this.checkoutImageFile(img);
        const { width, height, format } = this.getImageProp(img);
        const filename = `${sha1(img.buffer.toString())}.${format}`;

        // 如果图像已被上传过，直接返回数据库中的图像信息
        const olderImage = await this.olderImage(filename);
        if (olderImage !== null) return olderImage;

        // 先保存到本地服务器
        const { localPath, servicePath } = this.createImageSavePath();
        writeFileSync(pathJoin(localPath, filename), img.buffer);
        const path = pathJoin(servicePath, filename)
            .replace(/\\|\//g, '\\/')
            .replace(/^\\\//, '');

        // 保存到数据库
        const insertId = await this.saveImageInDb({
            path,
            width,
            height,
            size: img.size,
            from: ImageFrom.LOCAL,
        });

        const image = this.imageModel.find(insertId);
        return image;
    }

    /** 写入数据库 */
    private async saveImageInDb(imgData: Partial<ImageBase>) {
        const result = await this.imageModel.insert(imgData);
        return result.insertId;
    }

    /** 判斷圖像是否上傳過... */
    private async olderImage(filename: string) {
        const image = await this.imageModel.get({
            path: [OP.LIKE, `%${filename}`],
        });
        return image;
    }

    /** 返回圖像的保存路徑 */
    private createImageSavePath() {
        const date = new Date();
        const servicePath = pathJoin(
            '/',
            staticConfig.upload,
            staticConfig.uploadPic,
            `${date.getFullYear().toString()}-${fillZero(date.getMonth() + 1)}`,
        );
        const localPath = pathJoin(staticConfig.root, servicePath);
        touchPath(localPath);
        return {
            localPath,
            servicePath,
        };
    }

    /** 返回圖像信息 */
    private getImageProp(img: imageFile) {
        const { buffer } = img;
        const imageProp = getImageAttr(buffer);
        if (imageProp === null) throw new ApiException('圖像破損或不可用');
        return imageProp;
    }

    /** 校驗圖像大小和類型是否合法 */
    private checkoutImageFile(img: imageFile) {
        const { size, mimetype } = img;
        // 檢測文件大小
        if (size > appConfig.maxUploadImage)
            throw new ApiException(
                `圖像大小不可超過 ${(
                    appConfig.maxUploadImage /
                    (1024 * 1024)
                ).toFixed(2)} M`,
            );

        // 文件類型檢測
        if (
            !['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].includes(
                mimetype,
            )
        )
            throw new ApiException('非法文件類型');
    }
}
