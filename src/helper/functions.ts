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
