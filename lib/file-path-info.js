import path from 'node:path'

import chalk from 'chalk'

import { slugify } from './slugify.js'

const getFilePathInfo = async (filePath, { silent } = {}) => {
    try {
        const currentPath = path.parse(path.resolve(filePath))
        const newInfo = await slugify(currentPath.name, { silent })
        if (!newInfo.success) {
            return
        }
        const newPath = path.join(
            currentPath.dir,
            newInfo.newString + currentPath.ext
        )

        return {
            new: newPath,
            newParsed: path.parse(newPath),
            old: path.join(currentPath.dir, currentPath.name + currentPath.ext),
            oldParsed: currentPath,
        }
    } catch (error) {
        if (!silent) {
            console.warn(
                chalk.red(`error processing ${filePath}: ${error.toString()}`)
            )
        }
    }
}

export default getFilePathInfo
