import { appConfig } from '@config/app';
import { Queue } from './queue';

const { interval, MaxInterval } = appConfig.queue;
export const queue = new Queue(interval, MaxInterval);
