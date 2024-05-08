import { baseLog } from './lib/closest-parent-info.js'
import getFilePathInfo from './lib/file-path-info.js'
import ignore from './lib/ignore.js'
import { validateAndFormatInput } from './lib/path-validation.js'
import processOneFile from './lib/process-one-file.js'
import config from './lib/rc.js'
import useFdir from './lib/useFdir.js'

const logIgnored = (arrayOfFilePaths, lengthBefore, options, files) => {
    if (arrayOfFilePaths.length === 0) {
        !global.silent &&
            console.log(`no files to rename, as all were ignored.`)
        throw new Error('no files to rename.')
    }
    !global.silent &&
        console.log(`ignored ${lengthBefore - arrayOfFilePaths.length} files.`)
    !global.silent &&
        console.log(
            `${arrayOfFilePaths.length}/${files.length} ${
                options.dryrun ? `would` : `will`
            } be renamed.`
        )
}
const filesFoundInfo = (files, inputString) => {
    const numberFilesFoundInGlob = files.length
    if (numberFilesFoundInGlob === 1) {
        !global.silent && console.log(`found a file: ${files[0]}.`)
    } else {
        !global.silent &&
            console.log(
                `found ${numberFilesFoundInGlob} files in ${inputString.path ? inputString.path : `'${inputString.input}'`}.`
            )
        if (numberFilesFoundInGlob === 0) {
            !global.silent && console.log(`thus, exiting.`)
            throw new Error('no files found.')
        }
    }
}
const run = async (globPattern, userOptions) => {
    const options = userOptions
        ? Object.assign({}, config, userOptions)
        : config
    global.verbose = options.verbose
    global.silent = options.silent

    global.verbose && console.log(`DEBUG ON`)
    global.verbose &&
        console.log(`globPattern: ${globPattern}, userOpts: ${userOptions}`)
    const inputString = await validateAndFormatInput(globPattern)
    let files
    if (inputString.type === 'fileArray') {
        files = inputString.files
    } else if (
        inputString.type === 'directory' ||
        inputString.type === 'glob'
    ) {
        files = await useFdir(
            inputString.path,
            options.maxDepth,
            options.directories,
            inputString.type === 'glob'
        )
    }
    //is single file
    else {
        files = [inputString.path]
    }

    //console log that we got some shit to process.
    filesFoundInfo(files, inputString)

    //get pending new/old filepaths given our current options loadout
    let arrayOfFilePaths = []
    let fileNumber = 1
    for await (const file of files) {
        const filePathInfo = await getFilePathInfo(file, options.fixTildes)

        arrayOfFilePaths.push(filePathInfo)
    }

    //bugfix
    arrayOfFilePaths = arrayOfFilePaths.filter((f) => f !== null)

    const lengthBefore = arrayOfFilePaths.length
    arrayOfFilePaths = await ignore(arrayOfFilePaths)
    logIgnored(arrayOfFilePaths, lengthBefore, options, files)

    if (options.dryrun) {
        for await (const fileShit of arrayOfFilePaths) {
            await baseLog(fileShit)
        }
        //  console.log(resp.join('\n'))
    } else {
        for await (const file of arrayOfFilePaths) {
            await processOneFile(file, options.rename)
            await baseLog(file)
        }
    }
}
export default run
