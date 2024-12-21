import { logOldAndNewFilenames } from './lib/closest-parent-info.js'
import getFilePathInfo from './lib/file-path-info.js'
import ignore from './lib/ignore.js'
import { filesFoundInfo, logIgnored } from './lib/logging-functions.js'
import { validateAndFormatInput } from './lib/path-validation.js'
import processOneFile from './lib/process-one-file.js'
import config from './lib/rc.js'
import readDirectory from './lib/read-directory.js'
import useFdir from './lib/use-fdir.js'

const run = async (globPattern, userOptions) => {
    const options = userOptions
        ? Object.assign({}, config, userOptions)
        : config

    global.silent = options.silent

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
        const filePathInfo = await getFilePathInfo(file)
        arrayOfFilePaths.push(filePathInfo)
    }
    //filter out null paths (bugfix)
    arrayOfFilePaths = arrayOfFilePaths.filter((f) => f !== null)

    //Tell the user we ignored some garbage files
    const lengthBefore = arrayOfFilePaths.length
    arrayOfFilePaths = await ignore(arrayOfFilePaths)
    logIgnored(arrayOfFilePaths, lengthBefore, options, files)

    for await (const file of arrayOfFilePaths) {
        if (!options.dryrun) {
            await processOneFile(file, options.rename)
        }
        await logOldAndNewFilenames(file)
    }
}
export default run
