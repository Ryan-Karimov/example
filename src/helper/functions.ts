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
    return Math.floor(1000 * (1 + 9 * Math.random()))
}

export function replaceAll(input: string, word: string, to: string = ''): string {
    return input.split(word).join(to);
}

export function concatPaths(...values: string[]): string {
    const path = values.map((value) => replaceAll(value, '/')).join('/');

    return `/${path}`
}

export function generateHexFromUUID4() {
    return uuidv4().replace(/-/g, '');
}

export function getFileDirnaeAndBasename(fileFullPath: string) {
    return {
        dirname: path.dirname(fileFullPath),
        basename: path.basename(fileFullPath),
        format: path.extname(fileFullPath).toLowerCase().replace('.', '')
    }
}

export function removeFile(fullFilePath: string) {
    fs.rmdir(fullFilePath, (_err) => {
        console.log(`File not found to delete as: ${fullFilePath}`);
    })
}
