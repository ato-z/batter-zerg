import { staticConfig } from '@config/static';
import { join } from 'path';
import * as qiniu from 'qiniu';
import { ShortDBConfig } from '../db-config';

type QiniuConfig = {
    accessKey: string;
    secretKey: string;
    zone: string;
    useHttpsDomain: boolean;
    useCdnDomain: boolean;
    bucket: string;
    callbackUrl: string;
};

/**
 * 七牛云服务
 */
export class QiNiuService {
    private config: qiniu.conf.Config;
    private mac: qiniu.auth.digest.Mac;
    private bucket: string;
    private callBackInline: boolean;
    private callbackUrl: string;
    private readonly shortDBConfig = new ShortDBConfig<QiniuConfig>([
        1, 2, 3, 4, 5, 6, 13,
    ]);

    get shortConfig() {
        return this.shortDBConfig.config;
    }

    private async init() {
        const config = await this.shortConfig;
        this.bucket = config.bucket;
        this.callbackUrl = config.callbackUrl;

        this.checkCallbackInline();
        this.initConfig(config);
        this.initMac(config);
    }

    private async checkCallbackInline() {
        const { callbackUrl } = this;
        try {
            await fetch(callbackUrl, {
                method: 'HEADER',
            });
        } catch {
            throw new Error(`七牛雲圖像上傳成功回調地址異常 ${callbackUrl}`);
        }
    }

    private initMac({ accessKey, secretKey }: QiniuConfig) {
        this.mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    }

    private initConfig({ zone, useHttpsDomain, useCdnDomain }: QiniuConfig) {
        this.config = new qiniu.conf.Config({
            zone: qiniu.zone[zone],
            useHttpsDomain,
            useCdnDomain,
        });
    }

    get uploader() {
        return new qiniu.form_up.FormUploader(this.config);
    }

    protected getUploadToken(
        option: qiniu.rs.PutPolicyOptions = {
            callbackBody:
                '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
        },
    ) {
        const { bucket, mac, callbackUrl } = this;
        const options = Object.assign(
            {
                scope: bucket,
                callbackUrl,
                callbackBodyType: 'application/json',
            },
            option,
        );
        const putPolicy = new qiniu.rs.PutPolicy(options);
        const uploadToken = putPolicy.uploadToken(mac);
        return uploadToken;
    }

    async uploadByLocal(file: string, option?: qiniu.rs.PutPolicyOptions) {
        await this.init();
        const localFile = join(staticConfig.root, file);
        const uploadToken = this.getUploadToken(option);
        const formUploader = this.uploader;
        const putExtra = new qiniu.form_up.PutExtra();
        const key = file;
        return new Promise((resolve, reject) => {
            formUploader.putFile(
                uploadToken,
                key,
                localFile,
                putExtra,
                (respErr, respBody, respInfo) => {
                    if (respErr) return reject(respErr);
                    if (respInfo.statusCode === 200) return resolve(respBody);
                    reject({ body: respBody, info: respInfo });
                },
            );
        });
    }
}
