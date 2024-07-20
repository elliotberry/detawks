import fs from 'node:fs'
import path from 'node:path'

import chalk from 'chalk'
export const truncatePathIfPossible = (string_, parentDir) => {
    if (parentDir) {
        const truncated = string_.split(parentDir)[1]
        if (truncated) {
            return `...${truncated}`
        }
    }
    return string_
}

function isStringAGlobPattern(inputString) {
    const globPatternRegex = /\*/
    return globPatternRegex.test(inputString)
}

export const replaceAll = (string_, find, replace) => {
    return string_.split(find).join(replace)
}

//what is that character called??
export const replaceSquiglyWithHome = (string_) => {
    if (string_.includes('~')) {
        return replaceAll(string_, '~', process.env.HOME)
    }
    return string_
}

const getStats = async (inputString) => {
    try {
        const stats = await fs.promises.stat(inputString)

        return [stats.isDirectory(), stats.isFile()]
    } catch {
        return [false, false]
    }
}

const getFilePathType = async (inputString) => {
    const glob = await isStringAGlobPattern(inputString)

    let [isDirectory, isFile] = await getStats(inputString)
    if (isDirectory) {
        return 'directory'
    } else if (isFile) {
        return 'file'
    } else {
        const glob = isStringAGlobPattern(inputString)
        return glob ? 'glob' : 'invalid'
    }
}

//I realize this is convoluted, ah shit damn
//verify CLI input is valid
export const validateAndFormatInput = async (
    inputString,
    renameDirectories = false
) => {
    try {
        //zsh seems to be giving the first argument,...
        //when i put in a glob, as a file array, so, here goes nothing
        if (Array.isArray(inputString)) {
            try {
                const filesArray = []
                for await (const file of inputString) {
                    const abs = path.resolve(file)
                    if (renameDirectories === false) {
                        let [, isFile] = await getStats(abs)
                        if (isFile) {
                            filesArray.push(abs)
                        }
                    } else {
                        filesArray.push(abs)
                    }
                }
                return {
                    type: 'fileArray',
                    files: filesArray,
                }
            } catch (error) {
                throw new Error(
                    `error getting array of files from input: ${error}`
                )
            }
        }

        //i like to do this as a mac user so just making that fix there
        //it's disabled for now and i don't remember why
        // inputStr = await replaceSquiglyWithHome(inputStr)
        const type = await getFilePathType(inputString)
console.log('type', type)
        if (type === 'directory' || type === 'file') {
            const parentdir = type === 'directory' ? inputString : path.dirname(inputString)
            return {
                path: path.resolve(inputString),
                type,
                parent: parentdir,
                input: inputString,
            }
        } else if (type === 'glob') {
            return { path: inputString, type: 'glob', input: inputString }
        } else {
            throw new Error(`invalid input: ${inputString}`)
        }
    } catch {
        throw new Error(`invalid input: ${inputString}`)
    }
}
