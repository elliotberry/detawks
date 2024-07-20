import path from 'node:path'

import { slugify } from './slugify.js'

// Takes a file path and an optional boolean flag as input.
// Extracts information about the file, such as the directory, file name, and file extension.
// Creates a new file name that is a URL-friendly version of the original file name and returns an object that contains the old file path and the new file path if the new file name is different from the original file name. Otherwise, it returns null.
const getFilePathInfo = async (filePath) => {
    try {
        const currentPath = path.parse(path.resolve(filePath))
        let newName = await slugify(currentPath.name)
        let newExtension = currentPath.ext
    

        const newPath = path.join(currentPath.dir, newName + newExtension)
        return {
            new: newPath,
            newParsed: path.parse(newPath),
            old: path.join(currentPath.dir, currentPath.name + currentPath.ext),
            oldParsed: currentPath,
        }
    } catch (error) {
        !global.silent &&
            console.warn(`error processing ${filePath}: ${error.toString()}`)
    }
    return null
}
export default getFilePathInfo
