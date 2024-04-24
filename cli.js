#!/usr/bin/env node
import chalk from 'chalk'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import detawks from './index.js'
import { stringModificationFunctions } from './lib/slugify.js'

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
        })
        .option('r', {
            alias: 'rename',
            describe:
                'if overwrite possible, rename files AUTOMAGICALLY without prompting',
            type: 'boolean',
        })
        .option('n', {
            alias: 'numbered',

            type: 'boolean',
            default: false,
            describe:
                'numbered mode: fuck all the other renaming schemes, and just numbered all files 1-??.',
        })
        .option('f', {
            alias: 'dirs',
            describe: 'include directories',
            type: 'boolean',
            default: false,
        })
        .option('m', {
            alias: 'max-depth',
            describe: 'max depth',
            type: 'number',
            default: -1,
        })
        //options to list all available string modification functions
        .option('l', {
            alias: 'list',
            describe: 'list all available string modification functions',
            type: 'boolean',
        })
        .help('h')
        .alias('h', 'help')

    const argv = await parser.parse()
    let globPattern

    globPattern = argv._.length === 1 ? argv._[0] : argv._
    if (argv.l) {
        for (const [key] of Object.entries(stringModificationFunctions)) {
            const a = stringModificationFunctions[key]
            console.log(`${a.name}${a.description ? `: ${a.description}` : ''}`)
        }

        process.exit(0)
    } else {
        if (!globPattern) {
            console.error(chalk.red('no file pattern provided'))
            process.exit(1)
        }

        const dryrun = argv.d
        const directories = argv.f
        const rename = argv.r
        const silent = argv.s
        const verbose = argv.v
        const numbered = argv.n
        const userOptions = {
            numbered,
            verbose,
            dryrun,
            directories,
            rename,
            silent,
        }
        if (argv.m) {
            const maxDepth = Number.parseInt(argv.m)
            if (!Number.isNaN(maxDepth)) {
                userOptions.maxDepth = maxDepth
            }
        }
        const options = userOptions
        //console.log(argv)
        await detawks(globPattern, options)
    }
}
main()
