import path from 'path'
import config from './rc.js'
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
               !global.silent &&  console.log(`ignoring ${e.old}`)
                return null
            }
        })
    )
    ret = ret.filter((e) => e !== null)

    return ret
}

const ignore = async (arrayOfFilePaths) => {
    let newArrayOfFilePaths = await filterArrayAsync(arrayOfFilePaths)
    return newArrayOfFilePaths
}
export default ignore
