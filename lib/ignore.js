import config from './rc.js'
let ignoreFunction

const getIgnores = () => {
    let returnValue = null
    const ignores = config.ignores
    if (Array.isArray(ignores) && ignores.length > 0) {
        returnValue = ignores
    }
    if (returnValue === null) {
        throw new Error(`ignore config in the config file is not valid`)
    }
    return returnValue
}

const init = () => {
    const config_ = getIgnores()
    global.debug && console.log(`conf: ${config_}`)
    if (config_ === null) {
        return false
    }
    const arrayOfFns = []

    return (filePath) => {
        const nameToCompare = filePath.oldParsed.base
        for (const ignore of config_) {
            if (ignore === nameToCompare) {
                return false
            }
        }
        return true
    }
}

const ignore = async (arrayOfFilePaths) => {
    ignoreFunction = await init()
    return typeof ignoreFunction === 'function'
        ? arrayOfFilePaths.filter(ignoreFunction)
        : arrayOfFilePaths
}

export default ignore
