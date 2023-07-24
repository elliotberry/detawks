import yargs from 'yargs/yargs'
import { fdir } from 'fdir'
import path from 'path'
import getFilePathInfo from './lib/file-path-info.js'
import ignore from './lib/ignore.js'
import processOneFile from './lib/process-one-file.js'
import fs from 'fs'
var opts

var inputStr;
const truncatePathIfPossible = (str) => {
    if (inputStr.parentPath) {
        if (str.startsWith(inputStr.parentPath)) {
            return str.replace(inputStr.parentPath, inputStr.parent)
        }
    }
    return str
}

function isStringAGlobPattern(inputString) {
    const globPatternRegex = /[*]/
    return globPatternRegex.test(inputString)
}
const replaceAll = (str, find, replace) => {
    return str.split(find).join(replace)
}
const replaceSquiglyWithHome = (str) => {
    if (str.includes('~')) {
        return replaceAll(str, '~', process.env.HOME)
    }
    return str
}
//verify input
const getPathIfPath = async (globPath) => {
    let ret = null
    globPath = replaceSquiglyWithHome(globPath)
    try {
        let stats = await fs.promises.stat(globPath)
        if (stats.isDirectory() || stats.isFile()) {
            ret = {
                path: path.resolve(globPath),
                parent: path.dirname(globPath),
                parentPath: path.resolve(path.dirname(globPath)),
                type: stats.isDirectory() ? 'directory' : 'file',
            }
        }
    } catch (e) {
        ret = null
    }

    if (ret === null) {
        if (isStringAGlobPattern(globPath)) {
            ret = { path: globPath, type: 'glob' }
        }
    }

    return ret
}

const useFdir = async (globPattern) => {
    var files = []
    if (opts.directories) {
        !opts.silent && console.log(`including directories.`)
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

    return files
}

const run = async (globPattern) => {
    inputStr = await getPathIfPath(globPattern)
    if (inputStr === null) {
        console.log(`invalid input: ${globPattern}`)
        process.exit(1)
    }
    let files = await useFdir(globPattern)

    let filesFoundInGlob = files.length
    if (filesFoundInGlob === 0) {
        !opts.silent && console.log(`thus, exiting.`)
        process.exit(0)
    }
    !opts.silent &&
        console.log(`found ${filesFoundInGlob} files in ${inputStr.path}.`)

    let arrayOfFilePaths = await files.map((file) =>
        getFilePathInfo(file, opts.fixExts)
    )
    arrayOfFilePaths = await arrayOfFilePaths.filter((f) => f !== null)

    let lengthBefore = arrayOfFilePaths.length
    arrayOfFilePaths = await ignore(arrayOfFilePaths)
    !opts.silent &&
        console.log(`ignored ${lengthBefore - arrayOfFilePaths.length} files.`)
    !opts.silent &&
        console.log(
            `${arrayOfFilePaths.length}/${files.length} ${
                opts.dryrun ? `would` : `will`
            } be renamed.`
        )

    if (opts.dryrun) {
        !opts.silent &&
            console.log(
                arrayOfFilePaths
                    .map((f) => {
                        let oldPath = truncatePathIfPossible(f.old)
                        let newPath = truncatePathIfPossible(f.new)
                        return `${oldPath} -> ${newPath}`
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
        .describe(
            's',
            'silent mode; e.g no console.log describing new file names'
        )
        .default('s', false)
        .alias(
            'u',
            'fix unix file extensions created by backup scripts (e.g. .txt~)'
        )
        .describe(
            'u',
            'fix unix file extensions created by backup scripts (e.g. .txt~)'
        )
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
