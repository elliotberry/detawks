import fs from 'fs'
import fsp from 'node:fs/promises'
import path from 'path'
import chalk from 'chalk'
const processOneFile = async (fileObj, rename=true, fixTildes=false) => {
    try {

        !global.silent && console.log(`${fileObj.old} -> ${fileObj.new}`)

        if (fs.existsSync(fileObj.new)) {
            if (rename === true) {
                //ambiguous !global.silent && console.log(`file will be renamed: ${fileObj.new}`)
                let i = 1
                let parsed = path.parse(fileObj.new)
                let newName = `${parsed.name}-${i}${parsed.ext}`
                while (fs.existsSync(path.join(parsed.dir, newName))) {
                    i++
                    newName = `${parsed.name}-${i}${parsed.ext}`
                }
                fileObj.new = path.resolve(path.join(parsed.dir, newName))
                await fsp.rename(fileObj.old, fileObj.new)
            } else {
                throw new Error(chalk.red(`file already exists, doing nothing: ${fileObj.new}`))
            }
        } else {
            await fsp.rename(fileObj.old, fileObj.new)
        }
    } catch (e) {
        console.log(chalk.orange(`error processing ${fileObj.old}: ${e}`))
    }
}

export default processOneFile