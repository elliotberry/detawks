import chalk from 'chalk'

import config from './rc.js'
import stringModificationFunctions from './string-modification-functions.js'
let arrayOfFunctions;
let slugifyFunction;

//
// async/does an array of functions on a string in a row, and accumulates the result
//
const pipeFunctions = async (string_, ...fns) => {
    for await (const function_ of fns) {
        string_ = await function_.fn(string_, function_.args)
    }
    return string_
}

const init = () => {
    try {
        const slugifyConfig = config.sequence
        const finalFunctions = []
        for (const item of slugifyConfig) {
            if (stringModificationFunctions[item.name] === undefined) {
                console.warn(
                    chalk.red(
                        `String modification Function ${item.name} is not defined`
                    )
                )
            } else {
                finalFunctions.push({
                    fn: stringModificationFunctions[item.name].fn,
                    args: item.args || {},
                })
            }
        }

        arrayOfFunctions = finalFunctions
        if (finalFunctions.length === 0) {
            throw new Error(
                `error initializing slugify (fn factory): no functions in array`
            )
        }
        slugifyFunction = async (string_) => {
            return await pipeFunctions(string_, ...arrayOfFunctions)
        }
    } catch (error) {
        throw new Error(
            `error initializing slugify (fn factory): ${error.toString()}`
        )
    }
}

const slugify = async (string_) => {
    try {
        if (typeof slugifyFunction !== 'function') {
            throw new TypeError(
                `Slugification error: slugifyFunction is not a function`
            )
        }
        if (!string_) {
            throw new Error('Slugification error: String is undefined')
        }
        if (typeof string_ !== 'string') {
            throw new TypeError('Slugification error: String is not a string')
        }
        if (string_ === '') {
            throw new Error('Slugification error: String is empty')
        }
        if (!slugifyFunction || !arrayOfFunctions) {
            throw new Error(
                `Slugification error: looks like i fucked up the function constructor`
            )
        }
        let newString = await slugifyFunction(string_)
        if (string_ === '') {
            throw new Error(
                `Slugification error: String is empty. this means the array of modifications isn't set up well`
            )
        }
        return newString
    } catch (error) {
        console.warn(`Error slugifying ${string_}: ${error.toString()}`)
    }
}

init()

export { slugify }
export { default as stringModificationFunctions } from './string-modification-functions.js'
