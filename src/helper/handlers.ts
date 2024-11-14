import multer, { diskStorage } from 'multer';
import { mkdir as FsMakeDir } from 'fs';

import { getFileDirnameAndBasename, generateHexFromUUID4 } from '../helper';

export function UploadFileHandler(foldername: string, allowedTypes: Array<string>): multer.Multer {
    return multer({
        storage: diskStorage({
            destination: (_req, _file, cb) => {
                FsMakeDir(foldername, { recursive: true }, (err) => {
                    if (err) {
                        console.error('Error creating directory:', err);
                        return cb(err, '');
                    }
                    cb(null, foldername);
                });
            },
            filename: (_req, file, cb) => {
                const { format } = getFileDirnameAndBasename(file.originalname);
                const newFilename = `${generateHexFromUUID4()}.${format}`;

                file.filename = newFilename
                _req.body.image = newFilename
                cb(null, newFilename)
            },
        }),
        fileFilter: (_req, file, cb: multer.FileFilterCallback) => {
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                _req.body.image = null
                cb(null, false);
            }
        }
    });
}
