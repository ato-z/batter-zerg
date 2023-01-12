import { UseQueueController } from '../queue/queue';
import { ImageBase, ImageModel } from '@database/image.database';
import { PNG } from 'pngjs/browser';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';
import { staticConfig } from '@config/static';
import { fillZero } from '@src/tool';
import { appConfig } from '@config/app';
import { QueueList } from '../queue/list';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jpeg = require('jpeg-js');

const imageModel = new ImageModel();
export class ImageColorQueue implements UseQueueController {
    private readonly imageModel = imageModel;
    private list: QueueList;
    private errorTotal = 0;

    constructor(list: QueueList) {
        this.list = list;
    }

    handle() {
        this.pushQueue();
    }

    async tryMore() {
        if (this.errorTotal >= 10) {
            this.list.error.push({
                message: '解碼圖像失敗已超過 10次， 終止隊列',
                des: '錯誤次數超標',
                executeTime: 0,
            });
            return false;
        }
        return this.pushQueue();
    }

    private async pushQueue() {
        const list = await this.imageModel.selete({
            where: {
                and: {
                    color: null,
                },
            },
            limit: 8,
        });
        if (list === null) return false;
        list.forEach((item) =>
            this.list.push(
                () => this.saveImageColorByData(item.data),
                '计算图像主题色',
            ),
        );

        return true;
    }

    private async saveImageColorByData(image: ImageBase) {
        const start = Date.now();
        try {
            const color = await this.codeImageByLocalPath(image.path);
            await imageModel.update(
                {
                    color,
                },
                { where: { and: { id: image.id } } },
            );
            this.codeSuccess(image, start);
        } catch (err) {
            this.codeError(err, image, start);
        }
    }

    private async codeImageByLocalPath(path: string) {
        const suffix = path.split('.').pop();
        let color: string = appConfig.themeImageColor;
        const localPath = join(staticConfig.root, path);
        if (suffix === 'jpeg' || suffix === 'jpg') {
            color = this.withJPGImg(localPath);
        }
        if (suffix === 'png') {
            color = await this.withPNGImg(localPath);
        }
        return color;
    }

    private async withPNGImg(path: string) {
        const png = new PNG({ filterType: 4 });
        await new Promise((resolve) => {
            createReadStream(path).pipe(png).on('parsed', resolve);
        });

        return this.meanRgba(png.width, png.height, png.data);
    }

    private withJPGImg(path: string) {
        const buffer = readFileSync(path);
        const rawImageData = jpeg.decode(buffer);
        const color = this.meanRgba(
            rawImageData.width,
            rawImageData.height,
            rawImageData.data,
        );
        return color;
    }

    private meanRgba(w: number, h: number, matrix: Buffer) {
        const size = w * h;
        const rgb = [0, 0, 0];
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const idx = (w * y + x) << 2;
                rgb[0] += matrix[idx];
                rgb[1] += matrix[idx + 1];
                rgb[2] += matrix[idx + 2];
            }
        }

        return rgb
            .map((i) => Math.floor(i / size))
            .map((i) => fillZero(i.toString(16)))
            .join('');
    }

    private codeSuccess(image: ImageBase, start: number) {
        this.errorTotal -= 1;
        this.list.success.push({
            des: `圖像主題色解碼成功 ImgID：${image.id}`,
            executeTime: Date.now() - start,
        });
    }

    private codeError(error: any, image: ImageBase, start: number) {
        this.errorTotal += 1;
        const message =
            typeof error === 'string' ? error : error?.message ?? '未知異常';
        this.list.error.push({
            des: `解碼圖像主題色失敗 ImgID：${image.id}`,
            message,
            executeTime: Date.now() - start,
        });
    }
}
