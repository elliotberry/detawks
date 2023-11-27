import rc from 'rc'
import fs from 'fs'
import __dirname from './__dirname.js'
let conf = rc('detawks', JSON.parse(fs.readFileSync(`${__dirname}/default.detawksrc`)))


//clean up user-supplied rc files
const formatItem = (x) => {
    if (typeof x === "string") {
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
        } else {
            throw new Error(
                `sequence object must have a name property`
            )
        }
    } else {
        throw new Error(
            `sequence array item must be a string or an object`
        )
    }
}

const parseConf = () => {
   try {
        let seq = conf.sequence.map(formatItem)
        let ignores = conf.ignores
        delete conf.sequence
        delete conf.ignores
        let parsedConf = {
            ignores:ignores,
            sequence: seq,
            ...conf,
        }
        process.env.DEBUG && console.log(`parsed config: ${JSON.stringify(parsedConf, null, 2)}`)
        return parsedConf
    } catch (e) {
        console.error(`error parsing config file: ${e.toString()}`)
        process.exit(1)
    }
}
let config = parseConf()

export default config
