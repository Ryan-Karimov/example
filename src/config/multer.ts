import multer from 'multer';
import path from 'path';

const filePath = path.join(process.cwd(), 'static', 'profileImages');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, filePath);
    },
    filename: (req, file, cb) => {
        console.log(file);

        cb(null, file.originalname);
    }
});

export const upload = multer({ storage });
