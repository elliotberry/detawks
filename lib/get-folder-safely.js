import path from 'path'
var silent = process.env.SILENT
// Takes a folder path as input.
// Resolves the folder path and returns the absolute path.
// If an error occurs, logs the error and exits the process with a non-zero exit code.
const getFolderSafely = async (folderPath) => {
    try {
        return path.resolve(folderPath)
    } catch (e) {
        throw new Error(`error resolving ${folderPath}: ${e}`)
    }
}
export default getFolderSafely
