import { logOldAndNewFilenames } from './lib/closest-parent-info.js'
import getFilePathInfo from './lib/file-path-info.js'
import ignore from './lib/ignore.js'
import { validateAndFormatInput } from './lib/path-validation.js'
import processOneFile from './lib/process-one-file.js'
import config from './lib/rc.js'
import useFdir from './lib/use-fdir.js'

import { logIgnored, filesFoundInfo } from './lib/logging-functions.js'
import readDirectory from './lib/read-directory.js'
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
    } else if (inputString.type === 'directory') {
        files = await readDirectory(inputString.path, options.directories)
    } else if (inputString.type === 'glob') {
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
    filesFoundInfo(files, inputString, inputString.type)

    //get pending new/old filepaths given our current options loadout
    let arrayOfFilePaths = []

    for await (const file of files) {
        const filePathInfo = await getFilePathInfo(file, options.fixTildes)

        arrayOfFilePaths.push(filePathInfo)
    }

    
    arrayOfFilePaths = arrayOfFilePaths.filter((f) => f !== null)

    const lengthBefore = arrayOfFilePaths.length
    arrayOfFilePaths = await ignore(arrayOfFilePaths)
    logIgnored(arrayOfFilePaths, lengthBefore, options, files)

    if (options.dryrun) {
        for await (const filesInfo of arrayOfFilePaths) {
            await logOldAndNewFilenames(filesInfo)
        }

    } else {
        for await (const file of arrayOfFilePaths) {
            await processOneFile(file, options.rename)
            await logOldAndNewFilenames(file)
        }
    }
}
export default run
