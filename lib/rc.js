import rc from 'rc'


let conf = rc('detawks', {})

const parseConf = () => {
    try {
        let parsedConf = {
            ignores: conf.ignores,
            sequence: conf.sequence.map((x) => {
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
            }),
            ...conf,
        }
        return parsedConf
    } catch (e) {
        console.error(`error parsing config file: ${e.message}`)
        process.exit(1)
    }
}
let config = parseConf()

export default config
