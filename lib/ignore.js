import picomatch from 'picomatch'

import config from './rc.js'

const getIgnorePatterns = (ignores) => {
    const list = Array.isArray(ignores) ? ignores : config.ignores
    if (!Array.isArray(list) || list.length === 0) {
        throw new Error('ignore config in the config file is not valid')
    }
    return list
}

const createIgnoreMatcher = (ignores) => {
    const patterns = getIgnorePatterns(ignores)
    const isMatch = picomatch(patterns, { dot: true, matchBase: true })
    return (filePath) => {
        const trimmed = filePath.replace(/[/\\]+$/u, '')
        const parts = trimmed.split(/[/\\]/).filter(Boolean)
        return parts.some((part) => isMatch(part)) || isMatch(trimmed)
    }
}

const ignore = (arrayOfFilePaths, ignores) => {
    const isIgnored = createIgnoreMatcher(ignores)
    return arrayOfFilePaths.filter((file) => !isIgnored(file.old))
}

export { createIgnoreMatcher }
export default ignore
