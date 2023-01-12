import { UseQueueController } from '../queue/queue';
import { QueueList } from '../queue/list';
import { QiNiuService } from '../qiniu/qiniu.service';
import { ImageBase, ImageModel } from '@database/image.databser';
import { ImageFrom } from '@src/enum';

const imageModel = new ImageModel();
export class ImageQiniuQueue implements UseQueueController {
    private readonly qiniuService: QiNiuService = new QiNiuService();
    private readonly imageModel = imageModel;
    private errorTotal = 0;

    constructor(private readonly list: QueueList) {}

    async handle() {
        this.pushQueue();
    }

    async tryMore() {
        return this.pushQueue();
    }

    /** 添加隊列 */
    private async pushQueue() {
        if (this.errorTotal >= 10) {
            this.list.error.push({
                message: '七牛雲服務器異常，請檢查相關配置或代碼',
                des: '錯誤次數超標',
                executeTime: 0,
            });
            return false;
        }
        const list = await this.imageModel.selete({
            where: {
                and: { from: ImageFrom.LOCAL },
            },
            limit: 10,
        });
        if (list === null) return false;
        list.forEach(({ data }) =>
            this.list.push(
                () => this.uploadByImageBase(data),
                '本地圖像更新至七牛雲',
            ),
        );
        return true;
    }

    private uploadSuccess(image: ImageBase, start: number) {
        this.errorTotal -= 1;
        this.list.success.push({
            des: `圖像已上傳至七牛雲 ${image.path}`,
            executeTime: Date.now() - start,
        });
    }

    private uploadError(error: any, start: number) {
        this.errorTotal += 1;
        const message =
            error?.info?.statusMessage ??
            error?.body?.error ??
            error?.message ??
            '未知異常';
        this.list.error.push({
            des: '上傳七牛雲失敗',
            message,
            executeTime: Date.now() - start,
        });
    }

    /** 上傳單圖至七牛雲 */
    uploadByImageBase(image: ImageBase) {
        const start = Date.now();
        const callbackBody = JSON.stringify({
            key: '$(key)',
            id: image.id,
        });
        this.qiniuService
            .uploadByLocal(image.path, {
                callbackBody: callbackBody,
            })
            .then(
                () => this.uploadSuccess(image, start),
                (error) => this.uploadError(error, start),
            );
    }
}
