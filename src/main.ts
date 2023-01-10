import { resolve, join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { staticConfig } from '@config/static';
import { touchPath } from './tool';
import { appConfig } from '@config/app';
import { AppValidationPipe } from './validation';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

function createSwagger(app: NestExpressApplication) {
    const options = new DocumentBuilder()
        .setTitle(appConfig.swagger.title)
        .setVersion(appConfig.swagger.version)
        .setDescription(appConfig.swagger.des)
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/docs', app, document);
}

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    /** 开启静态服务器 */
    app.useStaticAssets(join(rootPath, staticConfig.static), {
        prefix: '/static',
    });

    /** 開啓校驗器 */
    app.useGlobalPipes(
        new AppValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    /** 接入文檔 */
    createSwagger(app);

    await app.listen(appConfig.runPort, appConfig.runIp);
}
bootstrap();
