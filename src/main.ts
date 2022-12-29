import { resolve, join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { staticConfig } from '@config/static';
import { touchPath } from './tool';
import { appConfig } from '@config/app';
import { ValidationPipe } from '@nestjs/common';
import tokenMiddleware from './middleware/token.middleware';

const rootPath = resolve(__dirname);
staticConfig.root = rootPath;

/**創建運行時目錄 */
touchPath(join(rootPath, staticConfig.runtime));
touchPath(join(rootPath, staticConfig.runtimeCache));
touchPath(join(rootPath, staticConfig.runtimeLog));
touchPath(join(rootPath, staticConfig.runtimeToken));

/** 靜態目錄 */
touchPath(join(rootPath, staticConfig.statiu));
touchPath(join(rootPath, staticConfig.upload));

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    /** 开启中间件 */
    app.use(tokenMiddleware);
    /** 開啓校驗器 */
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );
    await app.listen(appConfig.runPort, appConfig.runIp);
}
bootstrap();
