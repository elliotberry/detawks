#!/usr/bin/env node
import chalk from 'chalk'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import detawks from './index.js'
import { stringModificationFunctions } from './lib/slugify.js'

const main = async () => {
    const argv = await yargs(hideBin(process.argv))
        .usage('Usage: $0 [options] <glob / file / dir>')
        .option('s', {
            alias: 'silent',
            default: false,
            describe:
                'silent mode; no console output describing new file names. For use in scripts',
            type: 'boolean',
        })
        .option('d', {
            alias: ['dryrun', 'dry-run'],
            default: false,
            describe: 'dry run, showing what files would be renamed',
            type: 'boolean',
        })
        .option('r', {
            alias: 'rename',
            default: true,
            describe:
                'if a target name already exists, auto-suffix (file-01.ext). Use --no-rename to skip collisions',
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
            describe:
                'max directory depth (0 = this directory only; omit for unlimited)',
            type: 'number',
        })
        .option('b', {
            alias: 'batch-size',
            default: 50,
            describe: 'number of files to process concurrently (default: 50)',
            type: 'number',
        })
        .option('l', {
            alias: 'list',
            describe: 'list all available string modification functions',
            type: 'boolean',
        })
        .help('h')
        .alias('h', 'help')
        .parse()

    if (argv.l) {
        for (const [key, value] of Object.entries(stringModificationFunctions)) {
            const detail = value.description || value.name || ''
            console.log(detail ? `${key}: ${detail}` : key)
        }
        process.exit(0)
    }

    const positional = argv._.map(String).filter(Boolean)
    if (positional.length === 0) {
        console.error(chalk.red('no file pattern provided'))
        process.exit(1)
    }

    const globPattern = positional.length === 1 ? positional[0] : positional
    const userOptions = {
        batchSize: argv.b,
        directories: argv.f,
        dryrun: Boolean(argv.d || argv.dryrun || argv['dry-run']),
        rename: argv.r,
        silent: argv.s,
    }

    if (argv.m !== undefined && argv.m !== null && !Number.isNaN(argv.m)) {
        const maxDepth = Number.parseInt(argv.m, 10)
        if (maxDepth >= 0) {
            userOptions.maxDepth = maxDepth
        }
    }

    await detawks(globPattern, userOptions)
}

main().catch((error) => {
    console.error(chalk.red(error.message || error))
    process.exit(1)
})
