import path from 'node:path'

import exists from './exists.js'
import { logSkippedCollision } from './logging-functions.js'
import { nextAvailablePath } from './return-safe-filepath.js'

const isCaseInsensitiveVolume = process.platform === 'darwin'

const isSamePath = (pathA, pathB) => {
    if (pathA === pathB) {
        return true
    }
    return isCaseInsensitiveVolume && pathA.toLowerCase() === pathB.toLowerCase()
}

const isTakenFactory = (claimed, currentOld) => async (candidate) => {
    if (isSamePath(candidate, currentOld)) {
        return false
    }
    if ([...claimed].some((claimedPath) => isSamePath(claimedPath, candidate))) {
        return true
    }
    return exists(candidate)
}

const assignUniqueDestinations = async (
    files,
    { rename = true, silent = false } = {}
) => {
    const claimed = new Set()
    const kept = []
    const skipped = []

    for (const file of files) {
        const isTaken = isTakenFactory(claimed, file.old)
        const destinationExists = await isTaken(file.new)

        if (destinationExists && !rename) {
            logSkippedCollision(file, { silent })
            skipped.push(file)
            continue
        }

        const finalPath = destinationExists
            ? await nextAvailablePath(file.new, isTaken)
            : file.new

        claimed.add(finalPath)
        kept.push({
            ...file,
            new: finalPath,
            newParsed: path.parse(finalPath),
        })
    }

    return { files: kept, skipped }
}

export default assignUniqueDestinations
