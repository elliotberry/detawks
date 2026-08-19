import fs from 'node:fs/promises'
import path from 'node:path'

import exists from './exists.js'

const isDirectoryWithCatch = async (destination) => {
    try {
        const stats = await fs.stat(destination)
        return stats.isDirectory()
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false
        }
        throw error
    }
}

const parseExistingSuffix = (name) => {
    const dashed = name.split('-')
    if (dashed.length === 1) {
        return { nameWithoutSuffix: name, suffix: 1 }
    }
    const possibleSuffix = dashed.at(-1)
    const possibleSuffixNumber = Number.parseInt(possibleSuffix, 10)
    if (Number.isNaN(possibleSuffixNumber)) {
        return { nameWithoutSuffix: name, suffix: 1 }
    }
    return {
        nameWithoutSuffix: dashed.slice(0, -1).join('-'),
        suffix: possibleSuffixNumber,
    }
}

const formatSuffix = (suffix) => String(suffix).padStart(2, '0')

const makeDestination = (directory, nameWithoutSuffix, suffix, extension) =>
    path.join(
        directory,
        `${nameWithoutSuffix}-${formatSuffix(suffix)}${extension}`
    )

const nextAvailablePath = async (destination, isTaken) => {
    if (await isDirectoryWithCatch(destination)) {
        throw new Error('destination is a directory')
    }

    destination = path.resolve(destination)
    if (!(await isTaken(destination))) {
        return destination
    }

    const { dir, ext, name } = path.parse(destination)
    const { nameWithoutSuffix, suffix } = parseExistingSuffix(name)

    let count = suffix
    let candidate = makeDestination(dir, nameWithoutSuffix, count, ext)
    while (await isTaken(candidate)) {
        count += 1
        candidate = makeDestination(dir, nameWithoutSuffix, count, ext)
    }
    return candidate
}

const returnSafeFilePath = async (destination) =>
    nextAvailablePath(destination, exists)

export { nextAvailablePath }
export default returnSafeFilePath
