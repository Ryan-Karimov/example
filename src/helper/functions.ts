import fs from 'fs';
import path from 'path'
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function hash(word: string) {
    const hashed = await bcrypt.hash(word, 10);
    return hashed;
}

export async function compare(word: string, target: string) {
    const isValid = await bcrypt.compare(word, target);
    return isValid;
}

export function generateRandomNumber(): number {
    return Math.floor(1000 * (1 + 9 * Math.random()));
}

export function replaceAll(input: string, word: string, to: string = ''): string {
    return input.split(word).join(to);
}

export function concatPaths(...parts: Array<string>): string {
    const result = parts
        .map(part => part.replace(/^\/+|\/+$/g, ''))
        .join('/');
    return `/${result}`
}

export function generateHexFromUUID4() {
    return uuidv4().replace(/-/g, '');
}

export function getFileDirnameAndBasename(fileFullPath: string) {
    return {
        dirname: path.dirname(fileFullPath),
        basename: path.basename(fileFullPath),
        format: path.extname(fileFullPath).toLowerCase().replace('.', '')
    };
}

export function removeFile(fullFilePath: string) {
    fs.unlink(fullFilePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${err.message}`);
            return;
        }
        console.log('File deleted successfully');
    });
}

export function generateKey(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

export function getRandomColor() {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}