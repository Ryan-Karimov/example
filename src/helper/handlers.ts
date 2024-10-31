import multer, { diskStorage } from 'multer';
import { mkdir as FsMakeDir } from 'fs';

import { getFileDirnaeAndBasename, generateHexFromUUID4 } from '../helper'

export function UploadFileHandler(foldername: string, allowedTypes: Array<string>): multer.Multer {
    return multer({
        storage: diskStorage({
            destination: (_req, _file, cb) => {
                console.log('Preparing to create directory for uploads...');
                FsMakeDir(foldername, { recursive: true }, (err) => {
                    if (err) {
                        console.error('Error creating directory:', err);
                        return cb(err, '');
                    }
                    cb(null, foldername);
                });
            },
            filename: (_req, file, cb) => {
                const { format } = getFileDirnaeAndBasename(file.originalname)
                const newFilename = `${generateHexFromUUID4()}.${format}`

                cb(null, newFilename)
                file.originalname = newFilename
            },
        }),
        fileFilter: (_req, file, cb: multer.FileFilterCallback) => {
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true); // Accept the file
            } else {
                cb(null, false); // Reject the file
            }
        }
    });
}
