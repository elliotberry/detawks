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
    } else {
        let arrayOfFns = []

        const shouldFilterOut = (filePath) => {
            let nameToCompare = filePath.oldParsed.base
            let resp = true
            for (let ignore of config_) {
                if (ignore === nameToCompare) {
                    resp = false
                    break
                }
            }
            return resp
        }
        return shouldFilterOut
    }
}

const ignore = async (arrayOfFilePaths) => {
    ignoreFunction = await init()
    if (typeof ignoreFunction === 'function') {
        let newArrayOfFilePathsFiltered =
            arrayOfFilePaths.filter(ignoreFunction)
        return newArrayOfFilePathsFiltered
    } else {
        return arrayOfFilePaths
    }
}

export default ignore
