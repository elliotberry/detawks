import fs from 'node:fs/promises'
import path from 'node:path'

import exists from './exists.js'

const processOneFile = async (fileObject, rename = true) => {
    try {
        // !global.silent && console.log(`${f.old} -> ${f.new}`)

        if (await exists(fileObject.new)) {
            if (rename === true) {
                //ambiguous !global.silent && console.log(`file will be renamed: ${fileObj.new}`)
                let index = 1
                let parsed = path.parse(fileObject.new)
                let newName = `${parsed.name}-${index}${parsed.ext}`
                while (await exists(path.join(parsed.dir, newName))) {
                    index++
                    newName = `${parsed.name}-${index}${parsed.ext}`
                }
                fileObject.new = path.resolve(path.join(parsed.dir, newName))
                await fs.rename(fileObject.old, fileObject.new)
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
