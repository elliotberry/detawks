import getFilePathInfo from './lib/file-path-info.js'
import ignore from './lib/ignore.js'
import processOneFile from './lib/process-one-file.js'
import useFdir from './lib/useFdir.js'
import { validateAndFormatInput } from './lib/path-validation.js'
import { baseLog } from './lib/closest-parent-info.js'
import chalk from 'chalk'
import config from './lib/rc.js'

const logIgnored = (arrayOfFilePaths, lengthBefore, opts, files) => {
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
}
const filesFoundInfo = (files, inputStr) => {
    let numberFilesFoundInGlob = files.length
    if (numberFilesFoundInGlob === 1) {
        !global.silent && console.log(chalk.green(`found a file: ${files[0]}.`))
    } else {
        !global.silent &&
            console.log(
                chalk.green(
                    `found ${numberFilesFoundInGlob} files in ${inputStr.path}.`
                )
            )
        if (numberFilesFoundInGlob === 0) {
            !global.silent && console.log(chalk.red(`thus, exiting.`))
            process.exit(0)
        }
    }
}
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
    console.log(`inputStr: ${JSON.stringify(inputStr)}`)
    let files
    if (inputStr.type === 'fileArray') {
        files = inputStr.files
    }
    else if (inputStr.type === 'directory' || inputStr.type === 'glob') {
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

    //console log that we got some shit to process.
    filesFoundInfo(files, inputStr)

    //get pending new/old filepaths given our current options loadout
    let arrayOfFilePaths = []
    let fileNumber = 1
    for await (let file of files) {
        let filePathInfo = await getFilePathInfo(
            file,
            opts.fixTildes,
            opts.numbered ? fileNumber++ : null
        )

        arrayOfFilePaths.push(filePathInfo)
    }

    //bugfix
    arrayOfFilePaths = arrayOfFilePaths.filter((f) => f !== null)

    let lengthBefore = arrayOfFilePaths.length
    arrayOfFilePaths = await ignore(arrayOfFilePaths)
    logIgnored(arrayOfFilePaths, lengthBefore, opts, files)

    if (opts.dryrun) {
        for await (let fileShit of arrayOfFilePaths) {
            await baseLog(fileShit)
        }
        //  console.log(resp.join('\n'))
    } else {
        for await (let file of arrayOfFilePaths) {
            await processOneFile(file, opts.rename)
            await baseLog(file)
        }
        // await logChanges(arrayOfFilePaths)
    }
}
export default run
