#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import detawks from './index.js'
import { stringModificationFunctions } from './lib/slugify.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

const main = async () => {
    const parser = await yargs(hideBin(process.argv))
        .usage('Usage: $0 [options] <glob / file / dir>')
        .option('s', {
            alias: 'silent',
            describe:
                'silent mode; e.g no console.log describing new file names',
            type: 'boolean',
            default: false,
        })
        .option('v', {
            alias: 'verbose',
            describe:
                'verbose mode; logs files renamed, as well as other useful information',
            type: 'boolean',
            default: false,
        })
        .option('d', {
            alias: 'dryrun',
            describe: 'dry run, showing what files would be renamed',
            type: 'boolean',
            default: false,
        })
        .option('r', {
            alias: 'rename',
            describe:
                'if overwrite possible, rename files AUTOMAGICALLY without prompting',
            type: 'boolean',
            default: true,
        })
        .option('D', {
            alias: 'dirs',
            describe: 'include directories',
            type: 'boolean',
            default: false,
        })
        .option('m', {
            alias: 'max-depth',
            describe: 'max depth',
            type: 'number',
        })
        //options to list all available string modification functions
        .option('l', {
            alias: 'list',
            describe: 'list all available string modification functions',
            type: 'boolean',
            default: false,
        })
        .help('h')
        .alias('h', 'help')

    const argv = await parser.parse()
    const globPattern = argv._[0]
    if (argv.l) {
        for (const [key, value] of Object.entries(
            stringModificationFunctions
        )) {
            let a = stringModificationFunctions[key]
            console.log(`${a.name}${a.description ? ': ' + a.description : ''}`)
        }

        process.exit(0)
    } else {
        if (!globPattern) {
            console.log('no glob pattern provided')
            process.exit(1)
        }

        let dryrun = argv.d
        let directories = argv.f
        let rename = argv.r
        let silent = argv.s
        let userOpts = { dryrun, directories, rename, silent }
        if (argv.m) {
            let maxDepth = parseInt(argv.m)
            if (!isNaN(maxDepth)) {
                userOpts.maxDepth = maxDepth
            }
        }
        let opts = userOpts

        try {
            await detawks(globPattern, opts)
        } catch (e) {
            console.log(e.toString())
            process.exit(1)
        }
    }
}
main()
