import fs from 'fs'
import fsp from 'node:fs/promises'
import path from 'path'


const processOneFile = async (f, rename) => {
    try {
        console.log(`${f.old} -> ${f.new}`)

        if (fs.existsSync(f.new)) {
            if (rename === true) {
                console.log(`file will e renamed: ${f.new}`)
                let i = 1
                let parsed = path.parse(f.new)
                let newName = `${parsed.name}-${i}${parsed.ext}`
                while (fs.existsSync(path.join(parsed.dir, newName))) {
                    i++
                    newName = `${parsed.name}-${i}${parsed.ext}`
                }
                f.new = path.resolve(path.join(parsed.dir, newName))
                await fsp.rename(f.old, f.new)
            } else {
                throw new Error(`file already exists, doing nothing: ${f.new}`)
            }
        } else {
            await fsp.rename(f.old, f.new)
        }
    } catch (e) {
        console.log(`error processing ${f.old}: ${e}`)
    }
}

export default processOneFile