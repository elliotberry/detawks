import fs from 'node:fs';
import path from 'node:path';

export const truncatePathIfPossible = (string_, parentDirectory) => {
    if (parentDirectory && string_.includes(parentDirectory)) {
        return `...${string_.split(parentDirectory)[1]}`;
    }
    return string_;
};

const isStringAGlobPattern = (inputString) => /\*/.test(inputString);

export const replaceAll = (string_, find, replace) => string_.split(find).join(replace);

export const replaceSquiglyWithHome = (string_) =>
    string_.includes('~') ? replaceAll(string_, '~', process.env.HOME ?? '') : string_;

const getStats = async (inputString) => {
    try {
        const stats = await fs.promises.stat(inputString);
        return [stats.isDirectory(), stats.isFile()];
    } catch {
        return [false, false];
    }
};

const getFilePathType = async (inputString) => {
    const [isDirectory, isFile] = await getStats(inputString);
    if (isDirectory) return 'directory';
    if (isFile) return 'file';
    return isStringAGlobPattern(inputString) ? 'glob' : 'invalid';
};

export const validateAndFormatInput = async (inputString, renameDirectories = false) => {
    try {
        if (Array.isArray(inputString)) {
            const filesArray = [];
            for (const file of inputString) {
                const absPath = path.resolve(file);
                const [, isFile] = await getStats(absPath);
                if (renameDirectories || isFile) {
                    filesArray.push(absPath);
                }
            }
            return {
                files: filesArray,
                type: 'fileArray',
            };
        }

        // Uncomment if needed
        // inputString = replaceSquiglyWithHome(inputString);

        const type = await getFilePathType(inputString);
        if (type === 'directory' || type === 'file') {
            const parentDirectory = type === 'directory' ? inputString : path.dirname(inputString);
            return {
                input: inputString,
                parent: parentDirectory,
                path: path.resolve(inputString),
                type,
            };
        } else if (type === 'glob') {
            return { input: inputString, path: inputString, type: 'glob' };
        } else {
            throw new Error(`invalid input: ${inputString}`);
        }

    } catch (error) {
        throw new Error(`invalid input: ${inputString} - ${error.message}`);
    }
};
