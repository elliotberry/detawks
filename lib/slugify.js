import config from './rc.js'
import stringModificationFunctions from './string-modification-functions.js'
import chalk from 'chalk'
var arrayOfFunctions
var slugifyFunction

//
// async/does an array of functions on a string in a row, and accumulates the result
//
const pipeFunctions = async (str, ...fns) => {
    for await (const fn of fns) {
        str = await fn.fn(str, fn.args)
    }
    return str
}

const init = () => {
    try {
        let slugifyConfig = config.sequence
        let finalFunctions = []
        slugifyConfig.forEach((item) => {
            if (stringModificationFunctions[item.name] === undefined) {
                console.warn(
                   chalk.red(`String modification Function ${item.name} is not defined`)
                
                )
            } else {
                finalFunctions.push({
                    fn: stringModificationFunctions[item.name].fn,
                    args: item.args || {},
                })
            }
        })

        arrayOfFunctions = finalFunctions
        if (finalFunctions.length === 0) {
            throw new Error(
                `error initializing slugify (fn factory): no functions in array`
            )
        }
        slugifyFunction = async (str) => {
            return await pipeFunctions(str, ...arrayOfFunctions)
        }
    } catch (e) {
        throw new Error(
            `error initializing slugify (fn factory): ${e.toString()}`
        )
    }
}

const slugify = async (str) => {
    try {
        if (typeof slugifyFunction !== 'function') {
            throw new Error(
                `Slugification error: slugifyFunction is not a function`
            )
        }
        if (!str) {
            throw new Error('Slugification error: String is undefined')
        }
        if (typeof str !== 'string') {
            throw new Error('Slugification error: String is not a string')
        }
        if (str === '') {
            throw new Error('Slugification error: String is empty')
        }
        if (!slugifyFunction || !arrayOfFunctions) {
            throw new Error(
                `Slugification error: looks like i fucked up the function constructor`
            )
        }
        let newStr = await slugifyFunction(str)
        if (str === '') {
            throw new Error(
                `Slugification error: String is empty. this means the array of modifications isn't set up well`
            )
        }
        return newStr
    } catch (e) {
        console.warn(`Error slugifying ${str}: ${e.toString()}`)
    }
}

init()

export { slugify, stringModificationFunctions }
