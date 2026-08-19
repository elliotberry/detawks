import { splitGlobPattern, validateAndFormatInput } from './path-validation.js'
import { crawl } from './use-fdir.js'

const collectFiles = async (input, options = {}) => {
    const { directories = false, ignores, maxDepth } = options

    if (input.type === 'file') {
        return [input.path]
    }

    if (input.type === 'fileArray') {
        const collected = []
        for (const item of input.inputs) {
            const classified = await validateAndFormatInput(item)
            collected.push(...(await collectFiles(classified, options)))
        }
        return [...new Set(collected)]
    }

    if (input.type === 'glob') {
        const split = splitGlobPattern(input.path)
        return crawl(split.baseDirectory, {
            directories,
            glob: split.glob,
            ignores,
            maxDepth,
        })
    }

    return crawl(input.path, { directories, ignores, maxDepth })
}

export default collectFiles
