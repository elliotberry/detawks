import exists from 'elliotisms/exists'
import returnSafeFilepath from 'elliotisms/return-safe-filepath'
import fs from 'node:fs/promises'

const processOneFile = async (fileObject, rename = true) => {
    try {
        if (await exists(fileObject.new)) {
            if (rename === true) {
                const newPath = await returnSafeFilepath(fileObject.new)
                await fs.rename(fileObject.old, newPath)
            } else {
                console.warn(
                    `file already exists, doing nothing: ${fileObject.new}`
                )
            }
        } else {
            await fs.rename(fileObject.old, fileObject.new)
        }
    } catch (error) {
       throw new Error(`Error processing file: ${fileObject.old}; ${error}`)
    }
}

export default processOneFile
