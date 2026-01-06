import path from 'node:path';
import chalk from 'chalk';
import { slugify } from './slugify.js';

/**
 * Takes a file path as input, extracts information about the file,
 * creates a new URL-friendly file name, and returns an object containing
 * the old and new file paths.
 * @param {string} filePath - The file path to process.
 * @returns {Promise<object|undefined>} - An object with old and new file paths or undefined if an error occurs.
 */
const getFilePathInfo = async (filePath) => {
    try {
        const currentPath = path.parse(path.resolve(filePath));
        const newInfo = await slugify(currentPath.name);
        if (!newInfo.success) {
            return {};
        }
        let newName = newInfo.newString;
        const newPath = path.join(currentPath.dir, newName + currentPath.ext);

        return {
            new: newPath,
            newParsed: path.parse(newPath),
            old: path.join(currentPath.dir, currentPath.name + currentPath.ext),
            oldParsed: currentPath,
        };
    } catch (error) {
        if (!globalThis.silent) {
            console.warn(chalk.red(`error processing ${filePath}: ${error.toString()}`));
        }
    }
};

export default getFilePathInfo;
