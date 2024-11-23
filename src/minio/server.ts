import * as Minio from 'minio';
import { generateHexFromUUID4, getFileDirnameAndBasename } from '../helper';
import { StorageEngine } from 'multer';
import { Request } from 'express';

const minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'TzGodWYiNkGXAxjML1bU',
    secretKey: 'cjy1IuD135v81x6ROeCDuR6RqB2shPclpZUomGn0',
})


export class MinioStorage implements StorageEngine {
    constructor(private bucketName: string) { }

    _handleFile(req: Request, file: Express.Multer.File, cb: (error?: any, info?: Partial<Express.Multer.File>) => void) {

        const { format } = getFileDirnameAndBasename(file.originalname);
        const filename = `${generateHexFromUUID4()}.${format}`;
        const projectId = req.params.projectId;
        const objectName = `${projectId}/${filename}`;

        minioClient.putObject(
            this.bucketName,
            objectName,
            file.stream,
            file.size
        )
            .then(() => {
                cb(null, {
                    filename,
                    path: objectName,
                    size: file.size
                });
            })
            .catch(err => {
                cb(err);
            });
    }

    _removeFile(_req: Request, file: Express.Multer.File, cb: (error: Error | null) => void) {
        minioClient.removeObject(this.bucketName, file.path)
            .then(() => cb(null))
            .catch(err => cb(err));
    }

    _getObject(objectName: string) {
        return minioClient.getObject(this.bucketName, objectName);
    }

    _getObjectsByProject(projectId: string) {
        return minioClient.listObjects(this.bucketName, `${projectId}/`, true);
    }

    async _listObjects(prefix: string, recursive: boolean): Promise<Minio.BucketItem[]> {
        return new Promise((resolve, reject) => {
            const data: Minio.BucketItem[] = [];
            const stream = minioClient.listObjects(this.bucketName, prefix, recursive);

            stream.on('data', (obj) => {
                data.push(obj);
            });

            stream.on('end', () => {
                resolve(data);
            });

            stream.on('error', (err) => {
                reject(err);
            });
        });
    }

    _presignedGetObject(objectName: string, expires: number) {
        return minioClient.presignedGetObject(this.bucketName, objectName, expires);
    }
}