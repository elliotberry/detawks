import config from './rc.js'
let ignoreFn

const getIgnores = () => {
    let ret = null
    let ignores = config.ignores
    if (Array.isArray(ignores)) {
        if (ignores.length > 0) {
            ret = ignores
        }
    }
    if (ret === null) {
        throw new Error(`ignore config in the config file is not valid`)
    }
    return ret
}

const init = () => {
    let conf = getIgnores()
    global.debug && console.log(`conf: ${conf}`)
    if (conf !== null) {
        let arrayOfFns = []


        const shouldFilterOut = (filePath) => {
            let nameToCompare = filePath.oldParsed.base
            let resp = true
            for (let ignore of conf) {
                if (ignore === nameToCompare) {
                    resp = false
                    break
                }
            }
            return resp
        }
        return shouldFilterOut
    } else {
        return false
    }
}

const ignore = async (arrayOfFilePaths) => {
    ignoreFn = await init()
    if (typeof ignoreFn !== 'function') {
        return arrayOfFilePaths
    }
    else {
        let newArrayOfFilePathsFiltered = arrayOfFilePaths.filter(ignoreFn)
        return newArrayOfFilePathsFiltered
    }
}

export default ignore
