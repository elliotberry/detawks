import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const GLOB_CHARACTERS = /[*?[{]/

export const isGlobPattern = (inputString) => GLOB_CHARACTERS.test(inputString)

export const expandTilde = (string_) => {
    if (string_ === '~') {
        return os.homedir()
    }
    if (string_.startsWith('~/') || string_.startsWith('~\\')) {
        return path.join(os.homedir(), string_.slice(2))
    }
    return string_
}

const getStats = async (inputString) => {
    try {
        const stats = await fs.promises.stat(inputString)
        return [stats.isDirectory(), stats.isFile()]
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [false, false]
        }
        throw error
    }
}

const getFilePathType = async (inputString) => {
    if (isGlobPattern(inputString)) {
        return 'glob'
    }
    const [isDirectory, isFile] = await getStats(inputString)
    if (isDirectory) {
        return 'directory'
    }
    if (isFile) {
        return 'file'
    }
    return 'invalid'
}

export const splitGlobPattern = (pattern) => {
    const globIndex = pattern.search(GLOB_CHARACTERS)
    if (globIndex === -1) {
        return { baseDirectory: path.resolve(pattern), glob: '**/*' }
    }
    const prefix = pattern.slice(0, globIndex)
    const lastSeparator = Math.max(
        prefix.lastIndexOf('/'),
        prefix.lastIndexOf('\\')
    )
    if (lastSeparator === -1) {
        return { baseDirectory: process.cwd(), glob: pattern }
    }
    const baseDirectory = prefix.slice(0, lastSeparator) || process.cwd()
    return {
        baseDirectory: path.resolve(baseDirectory),
        glob: pattern.slice(lastSeparator + 1),
    }
}

export const validateAndFormatInput = async (inputString) => {
    if (Array.isArray(inputString)) {
        if (inputString.length === 0) {
            throw new Error('no file pattern provided')
        }
        return {
            inputs: inputString.map((item) => expandTilde(String(item))),
            type: 'fileArray',
        }
    }

    if (inputString === undefined || inputString === null || inputString === '') {
        throw new Error('no file pattern provided')
    }

    const normalized = expandTilde(String(inputString))
    const type = await getFilePathType(normalized)
    if (type === 'directory' || type === 'file') {
        return {
            input: normalized,
            parent:
                type === 'directory' ? normalized : path.dirname(normalized),
            path: path.resolve(normalized),
            type,
        }
    }
    if (type === 'glob') {
        return { input: normalized, path: normalized, type: 'glob' }
    }
    throw new Error(`invalid input: ${inputString}`)
}
