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
const baseLog = async (fpath) => {}

export { baseLog, findClosestParentDir }
