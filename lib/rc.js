import fs from 'node:fs'

import rc from 'rc'

import __dirname from './__dirname.js'
const config_ = rc(
    'detawks',
    JSON.parse(fs.readFileSync(`${__dirname}/default.detawksrc`))
)

//clean up user-supplied rc files
const formatItem = (x) => {
    if (typeof x === 'string') {
        return {
            name: x,
            args: {},
        }
    } else if (typeof x === 'object') {
        if (x.name) {
            if (!x.args) {
                x.args = {}
            }
            return x
        }
        throw new Error(`sequence object must have a name property`)
    } else {
        throw new TypeError(`sequence array item must be a string or an object`)
    }
}

const parseConfig = () => {
    try {
        const seq = config_.sequence.map(formatItem)
        const ignores = config_.ignores
        delete config_.sequence
        delete config_.ignores
        const parsedConfig = {
            ignores,
            sequence: seq,
            ...config_,
        }
        process.env.DEBUG &&
            console.log(
                `parsed config: ${JSON.stringify(parsedConfig, null, 2)}`
            )
        return parsedConfig
    } catch (error) {
        console.error(`error parsing config file: ${error.toString()}`)
        process.exit(1)
    }
}
const config = parseConfig()

export default config
