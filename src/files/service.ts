import { Request, Response } from "express";
import { FilesDB } from "./db";
import { MinioStorage } from "../minio/server";

export class UploadFileService {
    static async uploadFileToProject(_req: Request, _res: Response) {
        const { projectId } = _req.params;

        const uploadedFile = _req.files as Express.Multer.File[];
        const filesInfo = uploadedFile.map(file => ({
            filename: file.originalname,
            file_url: file.path.substring(file.path.indexOf('uploads')).replace(/\\/g, '/'),
            file_type: file.mimetype.split('/')[0].toUpperCase()
        }));

        const [filenames, fileUrls, fileTypes] = [
            filesInfo.map(file => file.filename),
            filesInfo.map(file => file.file_url),
            filesInfo.map(file => file.file_type)
        ];

        await FilesDB.createFile([projectId, filenames, fileUrls, fileTypes])

        _res.status(201).json({
            message: 'Files successfully uploaded'
        });
        return;
    }

    static async getProjectFile(_req: Request, _res: Response) {
        const { projectId, fileId } = _req.params;
        const [file] = await FilesDB.getFileById(fileId);

        if (!file) {
            return _res.status(404).json({ message: 'File not found' });
        }

        const fileName = file.file_url.split(/[/\\]/).pop() || '';
        const objectName = `${projectId}/${fileName}`;
        const stream = await new MinioStorage('projects')._getObject(objectName);

        stream.pipe(_res);
    }

    static async getProjectFiles(_req: Request, _res: Response) {
        const { projectId } = _req.params;
        const { state, page, limit } = _req.query;

        const files: { id: number; name: string; viewUrl: string }[] = [];
        const minioStorage = new MinioStorage('projects');

        const dbFiles = await FilesDB.getFilesByProjectId([projectId, state, page, limit]);
        console.log(dbFiles);

        const stream = await minioStorage._listObjects(`${projectId}/`, true);

        for await (const file of stream) {
            if (file.name) {
                const viewUrl = await minioStorage._presignedGetObject(file.name, 24 * 60 * 60);

                const fileName = file.name.replace(`${projectId}/`, '');

                const dbFile = dbFiles.find(f => {
                    if (!f || !f.file_url) return false;
                    const dbFileName = f.file_url.split('/').pop() || f.file_url.split('\\').pop() || '';
                    return dbFileName === fileName;
                });

                files.push({
                    id: dbFile.id,
                    name: fileName,
                    viewUrl
                });
            }
        }

        _res.status(200).json({
            message: 'Files successfully get!',
            data: {
                projectId,
                files
            }
        });
    }

    static async deleteProjectFile(_req: Request, _res: Response) {
        const { projectId, fileId } = _req.params;

        await FilesDB.deleteFile(fileId);

        _res.status(200).json({
            message: 'File successfully deleted'
        });
    }
}