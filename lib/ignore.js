import path from 'path'
import config from './rc.js'
import fg from 'fast-glob'

var ignoreFn
var silent = process.env.SILENT

const filterFn = (f) => {
    return new Promise((resolve, reject) => {
        let parsed = path.parse(f.old)
        let dir = parsed.dir.split(path.sep)
        let ignore = false

        if (config.ignores.includes(parsed.base)) {
            ignore = true
        }
        for (let i; i <= config.ignores.length; i++) {
            if (dir.includes(config.ignores[i])) {
                ignore = true
                break
            }
        }

        resolve(!ignore)
    })
}

async function filterArrayAsync(arrayOfFilePaths) {
    // Use Array.filter with an async function

    let ret = await Promise.all(
        arrayOfFilePaths.map(async (e) => {
            const isEvenNumber = await filterFn(e)
            if (isEvenNumber === true) {
                return e
            } else {
                !global.silent && console.log(`ignoring ${e.old}`)
                return null
            }
        })
    )
    ret = ret.filter((e) => e !== null)

    return ret
}
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
    if (conf !== null) {
        let shouldFilter = async (filePath) => {
            const entries = await fg(conf, { dot: true })
            return entries.includes(filePath)
        }
        return shouldFilter
    } else {
        return () => false
    }
}
ignoreFn = init()

const ignore = async (arrayOfFilePaths) => {
    let newArrayOfFilePathsFiltered = arrayOfFilePaths.filter((e) => {
        return ignoreFn(e)
    })
    return newArrayOfFilePathsFiltered
}
export default ignore
