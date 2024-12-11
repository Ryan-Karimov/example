import { NextFunction, Request, Response } from "express";
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { FilesDB, MEDIA_TYPE } from "./db";
import { MinioStorage } from "../minio/server";
import { ProjectDB } from "../apps/workspace/apps/projects/db";
import { ClassDB } from "../apps/workspace/apps/projects/apps/classes/db";
import { generateKey, getRandomColor } from "../helper";
import { FileState } from "./schema";
import { MetaDB } from "./apps/meta/db";
import yaml from "js-yaml";

export class UploadFileService {
    static async uploadFileToProject(_req: Request, _res: Response) {
        try {
            const { projectId } = _req.params;
            const uploadedFiles = _req.files as Express.Multer.File[];
            // console.log('uploadedFiles', uploadedFiles);

            const filesInfo = await UploadFileService.processUploadedFiles(uploadedFiles, projectId);
            await UploadFileService.saveFileMetadataToDB(projectId, filesInfo);

            _res.status(201).json({
                message: 'Files successfully uploaded'
            });
        } catch (error) {
            _res.status(400).json({
                message: "Failed to upload files",
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }

    // Обрабатывает список загруженных файлов
    static async processUploadedFiles(files: Express.Multer.File[], projectId: string) {
        const filesInfo: { filename: string; file_url: string; file_type: string; preview_url: string | null }[] = [];
        let warningFiles: { filename: string, warningCordinates: string }[] = [];
        let hasNewClass: number = 0;

        const project = await ProjectDB.getProjectWithTypeById([projectId]);

        for (const file of files) {
            if (file.mimetype.startsWith('video/')) {
                const fileInfo = await UploadFileService.handleVideoFile(file, projectId);
                filesInfo.push(fileInfo);

            } else if (file.mimetype.startsWith('text/')) {
                // if (project[0].type === 'Classification') continue;
                const ff = await FilesDB.getByFilename(projectId, file.originalname.replace('.txt', '.'), MEDIA_TYPE.IMAGE);
                const txtFile = await new MinioStorage('projects')._getObject(file.path);
                const fileContent = await new Promise((resolve, reject) => {
                    const chunks: Buffer[] = [];
                    txtFile.on('data', (chunk) => chunks.push(chunk));
                    txtFile.on('end', () => {
                        const fileContent = Buffer.concat(chunks).toString('utf-8');
                        resolve(fileContent);
                    });
                    txtFile.on('error', reject);
                });

                // Обработка строк файла
                const lines = (fileContent as string).split('\n').filter((v => v.length > 0));
                let metadata: any = [];
                for (const line of lines) {
                    const coordinates: any[] = line.split(' ').filter((v => v));
                    let [classOrder, x, y, width, height] = coordinates;

                    if (coordinates.length !== 5 || isNaN(classOrder) || isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
                        throw new Error(`Text file parse qilganda xatolik berdi! ${line}`);
                    }

                    let _class = await ClassDB.getClassByProjectId([projectId]);
                    if (!_class) {
                        _class = await ClassDB.createClass([projectId, classOrder, generateKey(7), 'white'])
                    }

                    for (let i = 0; i < ff.length; i++) {
                        metadata.push({ file_id: ff[i].id, class_id: _class.id, metadata: { x, y, width, height } })
                    }
                }
                for (let i = 0; i < ff.length; i++) {
                    const updateFileById = await FilesDB.updateFileById(ff[i].id, FileState.PROGRESS);
                }

                if (metadata.length) {
                    await MetaDB.hardDelete({ file_id: { $in: ff.map(file => file.id) } });
                    await MetaDB.createMany(metadata);
                }
            } else if (file.mimetype.endsWith('.yml') || file.mimetype.endsWith('.yaml')) {
                const yamlFile = await new MinioStorage('projects')._getObject(file.path);
                const fileContent = await new Promise((resolve, reject) => {
                    const chunks: Buffer[] = [];
                    yamlFile.on('data', (chunk) => chunks.push(chunk));
                    yamlFile.on('end', () => {
                        const fileContent = Buffer.concat(chunks).toString('utf-8');
                        resolve(fileContent);
                    });
                    yamlFile.on('error', reject);
                });
                const data: { names: string[] } = yaml.load(fileContent);
                let { names } = data;

                if (!names || !Array.isArray(names)) {
                    warningFiles.push({ filename: file.filename, warningCordinates: 'yaml file parse qilishda xatolik bor' });
                    throw new Error('Yaml file parse qilishda xatolik bor');
                }

                names.forEach(async (title, i) => {

                    let c = await ClassDB.getClassByProjectIdAndClassOrder(projectId, i);

                    if (!c) {
                        await ClassDB.createClass([projectId, i, title, getRandomColor()]);
                        return;
                    }

                    if (c.title === title) return;
                    await ClassDB.updateClass([projectId, c.id, title]);
                    return;
                })
            }
            else {
                filesInfo.push({
                    filename: file.originalname,
                    file_url: file.path.replace(/\\/g, '/').substring(file.path.indexOf('uploads')),
                    file_type: file.mimetype.split('/')[0].toUpperCase(),
                    preview_url: null,
                });
            }
        }

        return filesInfo;
    }

    // Обрабатывает видеофайл: создает превью и возвращает информацию о файле
    static async handleVideoFile(file: Express.Multer.File, projectId: string) {
        const frameFilename = `${path.parse(file.filename).name}_preview.jpg`;
        const tempPaths = await UploadFileService.saveVideoToTemp(file);
        const previewPath = path.join(os.tmpdir(), frameFilename);

        await UploadFileService.generateVideoPreview(tempPaths.videoPath, previewPath);
        const uploadedPreviewPath = await UploadFileService.uploadPreviewToStorage(previewPath, projectId, frameFilename);

        // Удаляем временные файлы
        fs.unlinkSync(tempPaths.videoPath);
        fs.unlinkSync(previewPath);

        return {
            filename: file.originalname,
            file_url: file.path.replace(/\\/g, '/').substring(file.path.indexOf('uploads')),
            file_type: file.mimetype.split('/')[0].toUpperCase(),
            preview_url: uploadedPreviewPath,
        };
    }

    // Сохраняет видео во временную директорию
    static async saveVideoToTemp(file: Express.Multer.File) {
        const fileStream = await new MinioStorage('projects')._getObject(file.path);
        const tempVideoPath = path.join(os.tmpdir(), `temp_${Date.now()}.mp4`);

        await new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(tempVideoPath);
            fileStream.pipe(writeStream);
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        return { videoPath: tempVideoPath };
    }

    // Генерирует превью для видео с помощью FFmpeg
    static async generateVideoPreview(videoPath: string, previewPath: string) {
        ffmpeg.setFfmpegPath(ffmpegPath.path);
        await new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .on('end', () => resolve('OK'))
                .on('error', reject)
                .screenshots({
                    timestamps: [0],
                    filename: path.basename(previewPath),
                    folder: path.dirname(previewPath),
                    size: '320x240',
                    outputOptions: ['-q:v 2'],
                });
        });
    }

    // Загружает превью в MinIO
    static async uploadPreviewToStorage(previewPath: string, projectId: string, frameFilename: string) {
        const previewStream = fs.createReadStream(previewPath);
        const previewStoragePath = `${projectId}/${frameFilename}`;
        await new MinioStorage('projects')._putObject(previewStoragePath, previewStream);

        return previewStoragePath.replace(/\\/g, '/');
    }

    // Сохраняет метаданные файлов в базу данных
    static async saveFileMetadataToDB(projectId: string, filesInfo: any[]) {
        const [filenames, fileUrls, fileTypes, states, previewUrls] = [
            filesInfo.map(file => file.filename),
            filesInfo.map(file => file.file_url),
            filesInfo.map(file => file.file_type),
            filesInfo.map(() => 'QUEUE'),
            filesInfo.map(file => file.preview_url),
        ];

        await FilesDB.createFile([projectId, filenames, fileUrls, fileTypes, states, previewUrls]);
    }


    static async getProjectFile(_req: Request, _res: Response) {
        const { projectId, fileId } = _req.params;
        const [file] = await FilesDB.getFileById(fileId);

        if (!file) {
            return _res.status(404).json({ message: 'File not found' });
        }

        const fileName = file.file_url.split('/').pop();
        const minioStorage = new MinioStorage('projects');
        const stream = await minioStorage._getObject(`${projectId}/${fileName}`);

        stream.pipe(_res);
    }

    static async getProjectFiles(_req: Request, _res: Response) {
        const { projectId } = _req.params;
        const { state, page, limit } = _req.query;

        const files: { id: number; name: string; viewUrl: string }[] = [];
        const minioStorage = new MinioStorage('projects');

        const dbFiles = await FilesDB.getFilesByProjectId([projectId, state, limit, page]);
        const count = await FilesDB.getFilesCountByProjectId([projectId, state]);

        if (dbFiles.length > 0) {
            const presignedUrls = await Promise.all(
                dbFiles.map(f =>
                    minioStorage._presignedGetObject(
                        `${projectId}/${f.file_url.split('/').pop()}`,
                        24 * 60 * 60
                    )
                )
            );

            files.push(...dbFiles.map((dbFile, index) => ({
                id: dbFile.id,
                name: dbFile.file_url.split('/').pop(),
                viewUrl: presignedUrls[index]
            })));
        }

        _res.status(200).json({
            message: 'Files successfully get!',
            count,
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