import { resolve, join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { staticConfig } from '@config/static';
import { touchPath } from 'tool';

const rootPath = resolve(__dirname, '../');
staticConfig.root = rootPath;

/**創建運行時目錄 */
touchPath(join(rootPath, staticConfig.runtime));
touchPath(join(rootPath, staticConfig.runtimeCache));
touchPath(join(rootPath, staticConfig.runtimeLog));
touchPath(join(rootPath, staticConfig.runtimeToken));

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}
bootstrap();
