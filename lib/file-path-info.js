import path from 'node:path';

import { slugify } from './slugify.js';

/**
 * Takes a file path as input, extracts information about the file,
 * creates a new URL-friendly file name, and returns an object containing
 * the old and new file paths.
 * @param {string} filePath - The file path to process.
 * @returns {Promise<object|null>} - An object with old and new file paths or null if an error occurs.
 */
const getFilePathInfo = async (filePath) => {
    try {
        const currentPath = path.parse(path.resolve(filePath));
        const newName = await slugify(currentPath.name);
        const newPath = path.join(currentPath.dir, newName + currentPath.ext);

        return {
            new: newPath,
            newParsed: path.parse(newPath),
            old: path.join(currentPath.dir, currentPath.name + currentPath.ext),
            oldParsed: currentPath,
        };
    } catch (error) {
        if (!globalThis.silent) {
            console.warn(`Error processing ${filePath}: ${error.toString()}`);
        }
        return null;
    }
};

export default getFilePathInfo;
