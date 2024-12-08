import chalk from 'chalk'
import { promises as fs } from 'node:fs'
import path from 'node:path'

async function findClosestParentDir(path1, path2) {
    // Normalize the paths to eliminate any redundant navigation
    const absolutePath1 = path.resolve(path1)
    const absolutePath2 = path.resolve(path2)

    // Split paths into components
    const parts1 = absolutePath1.split(path.sep)
    const parts2 = absolutePath2.split(path.sep)

    // Find common path parts
    const length = Math.min(parts1.length, parts2.length)
    let index = 0
    while (index < length && parts1[index] === parts2[index]) {
        index++
    }

    // If there is no common path, return null
    if (index === 0) {
        return null
    }

    // Construct the common directory path
    const commonPath = parts1.slice(0, index).join(path.sep)
    const commonDirName = parts1[index - 1]

    // Check if the common directory exists
    try {
        await fs.access(commonPath)
    } catch {
        throw new Error(`The common directory does not exist: ${commonPath}`)
    }

    // Calculate relative paths
    const relativePath1 = path.relative(commonPath, absolutePath1)
    const relativePath2 = path.relative(commonPath, absolutePath2)

    // Return the result as an object
    const object = {
        name: commonDirName,
        path: commonPath,
        relativePaths: {
            a: relativePath1,
            b: relativePath2,
        },
    }
    return `.../${object.name}/${object.relativePaths.a} -> .../${object.name}/${object.relativePaths.b}`
}

/**
 * Truncate a directory path to a specified length, keeping the filename intact.
 * @param {string} dirPath - The directory path to truncate.
 * @param {number} maxLength - The maximum length for the truncated path.
 * @return {string} - The truncated directory path.
 */
function truncateDirPath(dirPath, maxLength = 20) {
    if (dirPath.length <= maxLength) return dirPath

    const parts = dirPath.split(path.sep)
    let truncatedPath = ''
    while (parts.length > 0) {
        truncatedPath = path.join(parts.pop(), truncatedPath)
        if (truncatedPath.length >= maxLength) break
    }
    return `...${path.sep}${truncatedPath}`
}


function truncateFilePath(filePath, maxLength = 20) {
    const split = filePath.split('/');
    const basename = split.pop();
    let dirPath = split.join('/');

    if (filePath.length <= maxLength) {
        return filePath;
    }

    if (dirPath.length > maxLength) {
        const excessLength = dirPath.length - maxLength;
        let truncatedDirPath = '';
        let dirParts = dirPath.split('/');
        
        while (dirParts.length > 0) {
            const part = dirParts.shift();
            if (truncatedDirPath.length + part.length + 1 > maxLength) {
                break;
            }
            truncatedDirPath = truncatedDirPath ? `${truncatedDirPath}/${part}` : part;
        }
        dirParts = dirParts.filter((part) => part.length > 0);
        dirPath = `.${dirParts.join('/')}`;
    }

    return `${dirPath}/${basename}`;
}
const logOldAndNewFilenames = async (fpath) => {
    console.log(
        `${chalk.yellow(truncateFilePath(fpath.old))} -> ${chalk.green(truncateFilePath(fpath.new))}`
    )
}

export { findClosestParentDir,logOldAndNewFilenames }
