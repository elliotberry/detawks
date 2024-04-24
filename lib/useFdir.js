import { fdir } from 'fdir'

/**
 * Returns an array of file paths for a glob based on program opts.
 * args: {string} globPattern - The glob pattern to match against file paths.
 */
const useFdir = async (
    pattern,
    maxDepth,
    directories = false,
    glob = false
) => {
    try {
        let funktion = new fdir().withFullPaths()
        if (maxDepth) {
            funktion = funktion.withMaxDepth(maxDepth)
        }
        if (directories) {
            funktion = funktion.withDirs()
        }
        if (glob) {
            let t = await funktion.glob(pattern).crawl().withPromise()
            return t
        } else {
            return await funktion.crawl(pattern).withPromise()
        }
    } catch (error) {
        throw new Error(`error using fdir: ${error.toString()}`)
    }
}

export default useFdir
