import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'

import chalk from 'chalk'
const processOneFile = async (fileObject, rename = true, fixTildes = false) => {
    try {
        // !global.silent && console.log(`${f.old} -> ${f.new}`)

        if (fs.existsSync(fileObject.new)) {
            if (rename === true) {
                //ambiguous !global.silent && console.log(`file will be renamed: ${fileObj.new}`)
                let index = 1
                let parsed = path.parse(fileObject.new)
                let newName = `${parsed.name}-${index}${parsed.ext}`
                while (fs.existsSync(path.join(parsed.dir, newName))) {
                    index++
                    newName = `${parsed.name}-${index}${parsed.ext}`
                }
                fileObject.new = path.resolve(path.join(parsed.dir, newName))
                await fsp.rename(fileObject.old, fileObject.new)
            } else {
                throw new Error(
                    chalk.red(
                        `file already exists, doing nothing: ${fileObject.new}`
                    )
                )
            }
        } else {
            await fsp.rename(fileObject.old, fileObject.new)
        }
    } catch (error) {
        console.log(chalk.red(`error processing ${fileObject.old}: ${error}`))
    }
}

export default processOneFile
