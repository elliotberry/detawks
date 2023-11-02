import getFilePathInfo from './lib/file-path-info.js'
import ignore from './lib/ignore.js'
import processOneFile from './lib/process-one-file.js'
import useFdir from './lib/useFdir.js'
import { validateAndFormatInput } from './lib/path-validation.js'
import nicelyFormattedLog from './lib/closest-parent-info.js'
import chalk from 'chalk'
import config from './lib/rc.js'

const run = async (globPattern, userOpts) => {
    var opts
    if (userOpts) {
        opts = Object.assign({}, config, userOpts)
    } else {
        opts = config
    }
    global.verbose = opts.verbose
    global.silent = opts.silent

    global.verbose && console.log(`DEBUG ON`)
    global.verbose &&
        console.log(`globPattern: ${globPattern}, userOpts: ${userOpts}`)
    let inputStr = await validateAndFormatInput(globPattern)
    let files

    if (inputStr.type === 'directory' || inputStr.type === 'glob') {
        files = await useFdir(
            inputStr.path,
            opts.maxDepth,
            opts.directories,
            inputStr.type === 'glob'
        )
    }
    //is single file
    else {
        files = [inputStr.path]
    }

    let numberFilesFoundInGlob = files.length
    if (numberFilesFoundInGlob === 1) {
        !global.silent && console.log(chalk.green(`found a file: ${inputStr.path}.`))
    } else {
        !global.silent &&
            console.log(
                chalk.green(`found ${numberFilesFoundInGlob} files in ${inputStr.path}.`)
            )
        if (numberFilesFoundInGlob === 0) {
            !global.silent && console.log(chalk.orange(`thus, exiting.`))
            process.exit(0)
        }
    }

    let arrayOfFilePaths = []
    for await (let file of files) {
        let filePathInfo = await getFilePathInfo(file, opts.fixTildes)
        arrayOfFilePaths.push(filePathInfo)
    }

    //bugfix
    arrayOfFilePaths = arrayOfFilePaths.filter((f) => f !== null)

    let lengthBefore = arrayOfFilePaths.length
    arrayOfFilePaths = await ignore(arrayOfFilePaths)

    if (arrayOfFilePaths.length === 0) {
        !global.silent &&
            console.log(chalk.blue(`no files to rename, as all were ignored.`))
        process.exit(0)
    }
    !global.silent &&
        console.log(`ignored ${lengthBefore - arrayOfFilePaths.length} files.`)
    !global.silent &&
        console.log(
            chalk.blue(
                `${arrayOfFilePaths.length}/${files.length} ${
                    opts.dryrun ? `would` : `will`
                } be renamed.`
            )
        )

    if (opts.dryrun) {
        let resp = await Promise.all(
            arrayOfFilePaths.map(async (f) => {
                let str = await nicelyFormattedLog(f.old, f.new)
                return str
            })
        )

        console.log(resp.join('\n'))
    } else {
        for await (let file of arrayOfFilePaths) {
            await processOneFile(file, opts.rename)
        }
        // await logChanges(arrayOfFilePaths)
    }
}
export default run
