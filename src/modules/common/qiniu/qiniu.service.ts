import { appConfig } from '@config/app';
import { staticConfig } from '@config/static';
import { ConfigModel } from '@database/config.database';
import { ConfigService } from '@v1/config/condig.service';
import { join } from 'path';
import * as qiniu from 'qiniu';

const configModel = new ConfigModel();
const configService = new ConfigService(configModel);

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
    private dbConfigPending: Promise<unknown>;
    private callbackUrl: string;

    constructor() {
        this.dbConfigPending = this.init();
    }

    private async init() {
        const config = await configService.withOsConfig<QiniuConfig>([
            1, 2, 3, 4, 5, 6, 13,
        ]);
        this.bucket = config.bucket;
        this.callbackUrl = config.callbackUrl;
        this.initConfig(config);
        this.initMac(config);
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
        await this.dbConfigPending;
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
