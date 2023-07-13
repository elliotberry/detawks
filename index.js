
import yargs from 'yargs/yargs'
import { fdir } from 'fdir'

import getFilePathInfo from './lib/file-path-info.js'
import ignore from './lib/ignore.js'
import processOneFile from './lib/process-one-file.js'
var opts

const fdirBuilder = (globPattern) => {
    !opts.silent && console.log(`glob pattern: ${globPattern}`)
    let fns = []

    if (opts.directories) {
        fns.push('withDirs')
    }

    let base = new fdir().glob(globPattern)

    if (fns.length > 0) {
        base = fns.reduce((acc, fn) => acc[fn](), base)
    }

    return base.withFullPaths().crawl().withPromise()
}

const run = async (globPattern) => {
   

    let files
    if (opts.directories) {
        !opts.silent &&  console.log(`including directories.`)
        if (opts.maxDepth) {
            files = await new fdir()
                .withFullPaths()
                .withMaxDepth(opts.maxDepth)
                .withDirs()
                .crawl(globPattern)
                .withPromise()
        } else {
            files = await new fdir()
                .withFullPaths()
                .withDirs()
                .crawl(globPattern)
                .withPromise()
        }
    } else {
        if (opts.maxDepth) {
            files = await new fdir()
                .withMaxDepth(opts.maxDepth)
                .withFullPaths()
                .crawl(globPattern)
                .withPromise()
        } else {
            files = await new fdir()
                .withFullPaths()
                .crawl(globPattern)
                .withPromise()
        }
    }

    let filesFoundInGlob = files.length

    !opts.silent && console.log(`found ${filesFoundInGlob} files in ${globPattern}.`)

    if (filesFoundInGlob === 0) {
        !opts.silent &&  console.log(`thus, exiting.`)
        process.exit(0)
    }

    let arrayOfFilePaths = await files.map((file) => getFilePathInfo(file, opts.fixExts))
    arrayOfFilePaths = await arrayOfFilePaths.filter((f) => f !== null)

    let lengthBefore = arrayOfFilePaths.length
    arrayOfFilePaths = await ignore(arrayOfFilePaths)
    !opts.silent && console.log(`ignored ${lengthBefore - arrayOfFilePaths.length} files.`)
    !opts.silent && console.log(
        `${arrayOfFilePaths.length}/${files.length} ${
            opts.dryrun ? `would` : `will`
        } be renamed.`
    )

    if (opts.dryrun) {
        !opts.silent &&  console.log(
            arrayOfFilePaths
                .map((f) => {
                    return `${f.old} -> ${f.new}`
                })
                .join('\n')
        )
    } else {
        for await (let f of arrayOfFilePaths) {
            await processOneFile(f, opts.rename)
        }
    }
}

const main = async () => {
    var argv = yargs(process.argv.slice(2))
        .usage('Usage: $0 <glob> [options]')
        .boolean(['d', 'r', 'f', 'u', 's'])
        .describe('s', 'silent mode; e.g no console.log describing new file names')
        .default('s', false)
        .alias('u', 'fix unix file extensions created by backup scripts (e.g. .txt~)')
        .describe('u', 'fix unix file extensions created by backup scripts (e.g. .txt~)')
        .default('u', false)
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
        .alias('h', 'help').argv

    const globPattern = argv._[0]
    if (!globPattern) {
        console.log('no glob pattern provided')
        process.exit(1)
    }
    let dryrun = argv.d
    let directories = argv.f
    let rename = argv.r
    let fixExts = argv.u
    let silent = argv.s
    let userOpts = { dryrun, directories, rename, fixExts, silent }
    if (argv.m) {
        let maxDepth = parseInt(argv.m)
        if (!isNaN(maxDepth)) {
            userOpts.maxDepth = maxDepth
        }
    }
    opts = userOpts
    await run(globPattern)
}
main()
