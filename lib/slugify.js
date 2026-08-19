import chalk from 'chalk'

import config from './rc.js'
import stringModificationFunctions from './string-modification-functions.js'

let slugifyFunction
let hasFallbackToRandom = false
const slugifyCache = new Map()

const pipeFunctions = async (string_, ...fns) => {
    for (const function_ of fns) {
        string_ = await function_.fn(string_, function_.args)
    }
    return string_
}

const init = () => {
    const slugifyConfig = config.sequence
    const finalFunctions = []

    for (const item of slugifyConfig) {
        const function_ = stringModificationFunctions[item.name]?.fn
        if (!function_) {
            console.warn(
                `String modification Function ${item.name} is not defined`
            )
            continue
        }
        if (item.name === 'fallbackToRandom') {
            hasFallbackToRandom = true
        }
        finalFunctions.push({
            args: item.args || {},
            fn: function_,
        })
    }

    if (finalFunctions.length === 0) {
        throw new Error('Initialization error: no functions in array')
    }

    slugifyFunction = (string_) => pipeFunctions(string_, ...finalFunctions)
}

const cacheResult = (key, result) => {
    slugifyCache.set(key, result)
    if (slugifyCache.size > 1000) {
        const firstKey = slugifyCache.keys().next().value
        slugifyCache.delete(firstKey)
    }
}

const slugify = async (string_, { silent } = {}) => {
    try {
        if (typeof slugifyFunction !== 'function') {
            throw new TypeError('Slugify function is not initialized correctly')
        }
        if (typeof string_ !== 'string') {
            throw new TypeError('Input must be a string')
        }

        if (slugifyCache.has(string_)) {
            return slugifyCache.get(string_)
        }

        let newString = await slugifyFunction(string_)
        if (!newString && hasFallbackToRandom) {
            newString = stringModificationFunctions.fallbackToRandom.fn('')
        }

        if (!newString) {
            const result = { success: false }
            cacheResult(string_, result)
            if (!silent) {
                console.warn(
                    chalk.yellow(
                        `error slugifying "${string_}": resulting string is empty. Check modification functions.`
                    )
                )
            }
            return result
        }

        const result = { newString, success: true }
        cacheResult(string_, result)
        return result
    } catch (error) {
        if (!silent) {
            console.warn(
                chalk.yellow(
                    `error slugifying "${string_}": ${error.toString()}`
                )
            )
        }
        return { success: false }
    }
}

init()

export { slugify }
export { default as stringModificationFunctions } from './string-modification-functions.js'
