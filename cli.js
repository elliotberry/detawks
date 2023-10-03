#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import detawks from './index.js'

const main = async () => {
    const parser = await yargs(hideBin(process.argv))
        .usage('Usage: $0 [options] <glob>')
        .boolean(['d', 'r', 'f', 'u', 's'])
        .describe(
            's',
            'silent mode; e.g no console.log describing new file names'
        )
        .default('s', false)

        .alias('d', 'dry run')
        .describe('d', 'dry run, showing what files would be renamed')
        .default('d', false)
        .describe(
            'r',
            'if overwrite possible, rename files AUTOMAGICALLY without prompting'
        )
        .default('r', true)
        .describe('f', 'include directories')
        .default('f', false)
        .describe('m', 'max depth')
        .default('m', null)
        .help('h')
        .alias('h', 'help')
    const argv = await parser.parse()
    const globPattern = argv._[0]
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
main()
