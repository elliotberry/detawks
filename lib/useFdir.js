import { fdir } from 'fdir'
var silent = global.silent

/**
 * Returns an array of file paths for a glob based on program opts.
 * args: {string} globPattern - The glob pattern to match against file paths.
 */
const useFdir = async (globPattern, opts) => {
    try {
        var files = []
        if (opts.directories) {
            !global.silent && console.log(`including subdirectories.`)
            if (opts.maxDepth) {
                files = await new fdir()
                    .withFullPaths()
                    .withMaxDepth(opts.maxDepth)
                    .withDirs()
                    .crawl(globPattern)
                    .withPromise()
            } else {
                files = await new fdir()
                    .withFullPaths()
                    .withDirs()
                    .crawl(globPattern)
                    .withPromise()
            }
        } else {
            if (opts.maxDepth) {
                files = await new fdir()
                    .withMaxDepth(opts.maxDepth)
                    .withFullPaths()
                    .crawl(globPattern)
                    .withPromise()
            } else {
                files = await new fdir()
                    .withFullPaths()
                    .crawl(globPattern)
                    .withPromise()
            }
        }

        return files
    } catch (e) {
        throw new Error(`error using fdir: ${e.toString()}`)
    }
}

export default useFdir
