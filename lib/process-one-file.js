import exists from './exists.js'
import returnSafeFilepath from './return-safe-filepath.js'
import fs from 'node:fs/promises'
import { setTimeout } from 'node:timers/promises'

const performRename = async (fileObject, rename) => {
    if (fileObject.new === fileObject.old) {
        return
    }
    
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
}

const processOneFile = async (fileObject, rename = true, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await performRename(fileObject, rename)
            return // Success, exit retry loop
        } catch (error) {
            if (attempt === retries) {
                throw new Error(`Error processing file: ${fileObject.old}; ${error}`)
            }
            
            // Wait before retry (exponential backoff)
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
            await setTimeout(delay)
            
            if (!globalThis.silent) {
                console.warn(`Retry ${attempt}/${retries} for ${fileObject.old}: ${error.message}`)
            }
        }
    }
}

export default processOneFile
