import { EmptyQueue } from './empty';
import { QueueList } from './list';

export type UseQueueController = {
    handle(): void;
    tryMore(): Promise<boolean>;
};

export class Queue {
    private triggerRuning = false;
    private list = new QueueList();
    private readonly useList: Array<{
        controller: UseQueueController;
        nextTry: number;
        triggerInterval: number;
    }> = [];

    constructor(
        private readonly interval = 60000,
        private readonly maxInterval = 128 * 60000,
    ) {
        this.trigger();
    }

    use(Constructor: { new (list: QueueList): UseQueueController }) {
        const c = new Constructor(this.list);
        c.handle();
        this.useList.push({
            controller: c,
            nextTry: Date.now(),
            triggerInterval: this.interval,
        });
    }

    private async tryMore() {
        const { useList, interval, maxInterval } = this;
        useList.forEach(async (useItem) => {
            const { controller, nextTry, triggerInterval } = useItem;
            try {
                if (nextTry > Date.now()) return false;
                const useState = await controller.tryMore();
                useItem.triggerInterval = useState
                    ? interval
                    : Math.min(triggerInterval * 1.5, maxInterval);
                useItem.nextTry = Date.now() + useItem.triggerInterval;
            } catch (err) {
                this.postError(err, '添加隊列異常');
            }
        });

        const min = Math.min(...useList.map((i) => i.triggerInterval));
        setTimeout(() => this.trigger(), min);
    }

    private async trigger() {
        if (this.triggerRuning) return false;
        this.triggerRuning = true;
        const { list } = this;
        try {
            await list.shift();
            process.nextTick(() => this.trigger());
        } catch (err) {
            if (err instanceof EmptyQueue) this.tryMore();
        }
        this.triggerRuning = false;
    }

    private postError(err: unknown, des = '未知異常') {
        if (err instanceof Error) {
            this.list.error.push({
                des,
                message: `${err.message}\n${err.stack}`,
                executeTime: 0,
            });
        } else if (typeof err === 'string') {
            this.list.error.push({ des, message: err, executeTime: 0 });
        } else {
            this.list.error.push({ des, message: '網絡異常', executeTime: 0 });
        }
    }
}
