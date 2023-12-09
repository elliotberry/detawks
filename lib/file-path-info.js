import path from 'path'
import { slugify } from './slugify.js'
import chalk from 'chalk'

// Takes a file path and an optional boolean flag as input.
// Extracts information about the file, such as the directory, file name, and file extension.
// Creates a new file name that is a URL-friendly version of the original file name and returns an object that contains the old file path and the new file path if the new file name is different from the original file name. Otherwise, it returns null.
const getFilePathInfo = async (
    filePath,
    fixTildes = false,
    fileNumber = null
) => {
    let returnValue = null
    try {
        let newName
        let currentPath = path.parse(path.resolve(filePath))
        if (fileNumber !== null) {
            newName = `${fileNumber}`
        } else {
            newName = await slugify(currentPath.name)
        }
        let newExtension = currentPath.ext
        if (fixTildes) {
            newExtension = currentPath.ext.split('~').join('')
        }

        let newPath = path.join(currentPath.dir, newName + newExtension)
        returnValue = {
            oldParsed: currentPath,
            newParsed: path.parse(newPath),
            old: path.join(currentPath.dir, currentPath.name + currentPath.ext),
            new: newPath,
        }
    } catch (e) {
        !global.silent &&
            console.warn(
                chalk.yellow(`error processing ${filePath}: ${e.toString()}`)
            )
    }
    return returnValue
}
export default getFilePathInfo
