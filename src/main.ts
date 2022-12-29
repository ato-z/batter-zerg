import { resolve, join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { staticConfig } from '@config/static';
import { touchPath } from './tool';
import { appConfig } from '@config/app';
import { ValidationPipe } from '@nestjs/common';
import tokenMiddleware from './middleware/token.middleware';
import { NestExpressApplication } from '@nestjs/platform-express';

const rootPath = resolve(__dirname);
staticConfig.root = rootPath;

/**創建運行時目錄 */
touchPath(join(rootPath, staticConfig.runtime));
touchPath(join(rootPath, staticConfig.runtimeCache));
touchPath(join(rootPath, staticConfig.runtimeLog));
touchPath(join(rootPath, staticConfig.runtimeToken));

/** 靜態目錄 */
touchPath(join(rootPath, staticConfig.static));
touchPath(join(rootPath, staticConfig.upload));
touchPath(join(rootPath, staticConfig.upload, staticConfig.uploadPic));

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    /** 开启静态服务器 */
    app.useStaticAssets(join(rootPath, staticConfig.static), {
        prefix: '/static',
    });

    /** 開啓校驗器 */
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    /** 开启中间件 */
    app.use(tokenMiddleware);

    await app.listen(appConfig.runPort, appConfig.runIp);
}
bootstrap();
