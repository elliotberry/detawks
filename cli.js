#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import detawks from './index.js'
import { stringModificationFunctions } from './lib/slugify.js'
import chalk from 'chalk'

const main = async () => {
    const parser = await yargs(hideBin(process.argv))
        .usage('Usage: $0 [options] <glob / file / dir>')
        .option('s', {
            alias: 'silent',
            describe:
                'silent mode; e.g no console.log describing new file names',
            type: 'boolean',
        })
        .option('v', {
            alias: 'verbose',
            describe:
                'verbose mode; logs files renamed, as well as other useful information',
            type: 'boolean',
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
        .option('D', {
            alias: 'dirs',
            describe: 'include directories',
            type: 'boolean',
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
        })
        .help('h')
        .alias('h', 'help')

    const argv = await parser.parse()
    const globPattern = argv._[0]
    if (argv.l) {
        for (const [key] of Object.entries(stringModificationFunctions)) {
            let a = stringModificationFunctions[key]
            console.log(`${a.name}${a.description ? ': ' + a.description : ''}`)
        }

        process.exit(0)
    } else {
        if (!globPattern) {
            console.error(chalk.red('no file pattern provided'))
            process.exit(1)
        }

        let dryrun = argv.d
        let directories = argv.f
        let rename = argv.r
        let silent = argv.s
        let verbose = argv.v
        let numbered = argv.n
        let userOpts = {
            numbered,
            verbose,
            dryrun,
            directories,
            rename,
            silent,
        }
        if (argv.m) {
            let maxDepth = parseInt(argv.m)
            if (!isNaN(maxDepth)) {
                userOpts.maxDepth = maxDepth
            }
        }
        let opts = userOpts

      
            await detawks(globPattern, opts)
      
    }
}
main()
