import path from 'node:path'

import { fdir } from 'fdir'

import { createIgnoreMatcher } from './ignore.js'
import { splitGlobPattern } from './path-validation.js'
import config from './rc.js'

const crawl = async (
    baseDirectory,
    { directories = false, glob, ignores = config.ignores, maxDepth } = {}
) => {
    const isIgnored = createIgnoreMatcher(ignores)
    let builder = new fdir().withRelativePaths()

    if (typeof maxDepth === 'number' && maxDepth >= 0) {
        builder = builder.withMaxDepth(maxDepth)
    }
    if (directories) {
        builder = builder.withDirs()
    }

    builder = builder.exclude((directoryName) => isIgnored(directoryName))

    if (glob) {
        builder = builder.glob(glob)
    }

    try {
        const relativePaths = await builder.crawl(baseDirectory).withPromise()
        const resolvedRoot = path.resolve(baseDirectory)
        return relativePaths
            .filter(
                (relativePath) =>
                    relativePath !== '.' && relativePath !== './'
            )
            .map((relativePath) => path.resolve(baseDirectory, relativePath))
            .filter((absolutePath) => absolutePath !== resolvedRoot)
    } catch (error) {
        throw new Error(`error using fdir: ${error.message}`, { cause: error })
    }
}

const useFdir = async (
    pattern,
    maxDepth,
    directories = false,
    glob = false
) => {
    if (glob) {
        const split = splitGlobPattern(pattern)
        return crawl(split.baseDirectory, {
            directories,
            glob: split.glob,
            maxDepth,
        })
    }
    return crawl(pattern, { directories, maxDepth })
}

export { crawl }
export default useFdir
