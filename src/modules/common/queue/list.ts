import { EmptyQueue } from './empty';

export enum Statu {
    WAIT = 0,

    EXECUTE = 1,

    SUCCESS = 2,

    ERROR = 3,
}

/**
 * 队列的进出队
 */
export class QueueList {
    readonly wait: Array<{
        statu: Statu;
        des: string;
        fn: () => unknown;
    }> = [];

    readonly success: Array<{ des: string; executeTime: number }> = [];
    readonly error: Array<{
        des: string;
        message: string;
        executeTime: number;
    }> = [];

    push(fn: () => unknown, des: string, statu: Statu = Statu.WAIT) {
        this.wait.push({ statu, fn, des });
    }

    async shift() {
        const current = this.wait.shift();
        if (current === undefined) throw new EmptyQueue();
        const { fn, des } = current;
        const start = Date.now();
        try {
            await fn();
            this.success.push({
                des,
                executeTime: Date.now() - start,
            });
        } catch (err) {
            const message =
                err instanceof Error
                    ? `${err.message}\n${err.stack}`
                    : '未知異常';
            this.error.push({
                des,
                message,
                executeTime: Date.now() - start,
            });
        }
    }
}
