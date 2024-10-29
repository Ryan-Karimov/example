export const getEnvParam = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    if (value === undefined || value === '') {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Environment variable ${key} is not defined and no default value is provided.`);
    }
    return value;
};

export const getEnvAsNumber = (key: string, defaultValue: number): number => {
    const value = parseInt(getEnvParam(key, defaultValue.toString()), 10);
    if (isNaN(value)) {
        throw new Error(`Environment variable ${key} is not a valid number.`);
    }
    return value;
};
