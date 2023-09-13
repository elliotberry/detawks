import path from 'path'
import fs from 'fs'
var silent = process.env.SILENT

export const truncatePathIfPossible = (str) => {
    if (str.parentPath) {
        if (str.startsWith(str.parentPath)) {
            return str.replace(str.parentPath, str.parent)
        }
    }
    return str
}

function isStringAGlobPattern(inputString) {
    const globPatternRegex = /[*]/
    return globPatternRegex.test(inputString)
}

export const replaceAll = (str, find, replace) => {
    return str.split(find).join(replace)
}

//what is that character called??
export const replaceSquiglyWithHome = (str) => {
    if (str.includes('~')) {
        return replaceAll(str, '~', process.env.HOME)
    }
    return str
}
const getStats = async (inputStr) => {
    let stats = await fs.promises.stat(inputStr)

    return [stats.isDirectory(), stats.isFile()]
}
//verify CLI input is valid
export const validateAndFormatInput = async(inputStr) => {
    try {
        //i like to do this as a amc user so just making that fix there
        inputStr = replaceSquiglyWithHome(inputStr)
        let [isDirectory, isFile] = await getStats(inputStr)
    
        if (isDirectory || isFile) {
            return {
                path: path.resolve(inputStr),
                type: isDirectory ? 'directory' : 'file',
            }
        } else if (isStringAGlobPattern(inputStr)) {
            return { path: inputStr, type: 'glob' }
        } else {
            throw new Error(`invalid input: ${inputStr}`)
        }
    } catch (e) {
        throw new Error(`invalid input: ${inputStr}. error: ${e.toString()}`)
    }
}
