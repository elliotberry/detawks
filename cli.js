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
            default: false,
            describe:
                'silent mode; e.g no console.log describing new file names. For use in scripts',
            type: 'boolean',
        })
    
        .option('d', {
            alias: 'dryrun',
            default: false,
            describe: 'dry run, showing what files would be renamed',
            type: 'boolean',
        })
        .option('r', {
            alias: 'rename',
            default: true,
            describe:
                'if overwrite is possible, rename files AUTOMAGICALLY without prompting',
            type: 'boolean',
        })
        .option('f', {
            alias: 'dirs',
            default: false,
            describe: 'include directories',
            type: 'boolean',
        })
        .option('m', {
            alias: 'max-depth',
            default: -1,
            describe: 'max depth',
            type: 'number',
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

        const userOptions = {
            directories,
            dryrun,
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

        await detawks(globPattern, options)
    }
}
main()
