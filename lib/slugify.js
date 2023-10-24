
import config from './rc.js'
import stringModificationFunctions from './string-modification-functions.js'

var arrayOfFunctions
var slugifyFunction


//
// async/does an array of functions on a string in a row, and accumulates the result
//
const pipeFunctions = (str, ...fns) => {
    for (const fn of fns) {
        str = fn.fn(str, fn.args)
    }
    return str
}

const init = () => {
    let slugifyConfig = config.sequence
 
    let finalFunctions = []
    slugifyConfig.forEach((item) => {
  
        if (stringModificationFunctions[item.name] === undefined) {
            console.warn(`String modification Function ${item.name} is not defined`)
        } else {
            finalFunctions.push({fn: stringModificationFunctions[item.name].fn, args: item.args || {}})
        }
    })

    arrayOfFunctions = finalFunctions
    slugifyFunction = (str) => {
        return pipeFunctions(str, ...arrayOfFunctions)
    }
}

const slugify = (str) => {
    if (!str) {
        throw new Error('String is undefined')
    }
    if (typeof str !== 'string') {
        throw new Error('String is not a string')
    }
    if (str === '') {
        throw new Error('String is empty')
    }
    if (!slugifyFunction || !arrayOfFunctions) {
        throw new Error(`looks like i fucked up the function constructor`)
    }
    str = slugifyFunction(str)
    if (str === '') {
        throw new Error(`String is empty. this means the array of modifications isn't set up well`)
    }
    return str
}

init()

export {slugify, stringModificationFunctions}
