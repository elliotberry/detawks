import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
export const truncatePathIfPossible = (str, parentDir) => {
    if (parentDir) {
        let truncated = str.split(parentDir)[1]
        if (truncated) {
            return `...${truncated}`
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
    try {
        let stats = await fs.promises.stat(inputStr)

        return [stats.isDirectory(), stats.isFile()]
    } catch (e) {
        return [false, false]
    }
}

const getFilePathType = async (inputStr) => {
    let glob = await isStringAGlobPattern(inputStr);

    let [isDirectory, isFile] = await getStats(inputStr)
    if (isDirectory) {
        return 'directory'
    } else if (isFile) {
        return 'file'
    } else {
        let glob = isStringAGlobPattern(inputStr)
        if (glob) {
            return 'glob'
        } else {
            return 'invalid'
        }
    }
}

//I realize this is convoluted, ah shit damn
//verify CLI input is valid
export const validateAndFormatInput = async (inputStr) => {
    try {
        //i like to do this as a amc user so just making that fix there
       // inputStr = await replaceSquiglyWithHome(inputStr)
        let type = await getFilePathType(inputStr)

        if (type === 'directory' || type === 'file') {
            let parentdir
            if (type === 'directory') {
                parentdir = inputStr
            } else {
                parentdir = path.dirname(inputStr)
            }
            return {
                path: path.resolve(inputStr),
                type: type,
                parent: parentdir,
            }
        } else if (type === 'glob') {
            return { path: inputStr, type: 'glob' }
        } else {
            throw new Error(chalk.red(`invalid input: ${inputStr}`))
        }
    } catch (e) {
        throw new Error(chalk.red(`invalid input: ${inputStr}`))
    }
}
