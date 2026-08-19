import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import rc from 'rc'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const defaultConfigPath = path.join(packageRoot, 'default.detawksrc')

const config_ = rc('detawks', JSON.parse(fs.readFileSync(defaultConfigPath, 'utf8')))

const formatItem = (item) => {
    if (typeof item === 'string') {
        return {
            args: {},
            name: item,
        }
    }
    if (typeof item === 'object' && item !== null) {
        if (item.name) {
            if (!item.args) {
                item.args = {}
            }
            return item
        }
        throw new Error(`sequence object must have a name property`)
    }
    throw new TypeError(`sequence array item must be a string or an object`)
}

const parseConfig = () => {
    const seq = config_.sequence.map((item) => formatItem(item))
    const ignores = config_.ignores
    delete config_.sequence
    delete config_.ignores
    return {
        ignores,
        sequence: seq,
        ...config_,
    }
}

const config = parseConfig()

export default config
