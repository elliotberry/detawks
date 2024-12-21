import fs from 'node:fs'
import rc from 'rc'

import __dirname from '../test/__dirname.js'
const config_ = rc(
    'detawks',
    JSON.parse(fs.readFileSync(`${__dirname}/default.detawksrc`))
)

//clean up user-supplied rc files
const formatItem = (x) => {
    if (typeof x === 'string') {
        return {
            args: {},
            name: x,
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
    const seq = config_.sequence.map(formatItem)
    const ignores = config_.ignores
    delete config_.sequence
    delete config_.ignores
    const parsedConfig = {
        ignores,
        sequence: seq,
        ...config_,
    }
    return parsedConfig
}
const config = parseConfig()

export default config
