import fs from 'node:fs/promises'
import path from 'node:path'
import returnSafeFilepath from './return-safe-filepath.js'
import exists from './exists.js'

const processOneFile = async (fileObject, rename = true) => {
    try {
       

        if (await exists(fileObject.new)) {
            if (rename === true) {
                let newPath = await returnSafeFilepath(fileObject.new)
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
        console.log(`error processing ${fileObject.old}: ${error}`)
    }
}

export default processOneFile
