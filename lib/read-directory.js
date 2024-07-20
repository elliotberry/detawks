import fs from 'node:fs/promises'
import path from 'node:path'
const readDirectory = async (directory, includeDirectories = false) => {

    let files = await fs.readdir(directory, {
        recursive: true,
        withFileTypes: true,
    })

    files = files
        .map((f) => {
            let ret = path.join(f.path, f.name)
            if (includeDirectories === false) {
                ret = path.join(f.path, f.name)
                const objectSymbols = Object.getOwnPropertySymbols(f)

                if (f[objectSymbols[0]] !== 1) {
                    ret = null
                }
            }
            return ret
        })
        .filter((f) => f !== null)

    return files
}

export default readDirectory
