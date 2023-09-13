import getFilePathInfo from './lib/file-path-info.js'
import ignore from './lib/ignore.js'
import processOneFile from './lib/process-one-file.js'
import useFdir from './lib/useFdir.js'
import {
    validateAndFormatInput,
    truncatePathIfPossible,
} from './lib/path-validation.js'
import logChanges from './lib/log-changes.js'
import chalk from 'chalk'



const run = async (
    globPattern,
    opts = {
        dryrun: false,
        directories: false,
        rename: true,
        silent: false,
        maxDepth: null,
    }
) => {
    process.env.SILENT = opts.silent
    var silent = opts.silent
    let inputStr = await validateAndFormatInput(globPattern)
    let files

    if (inputStr.type === 'directory' || inputStr.type === 'glob') {
        files = await useFdir(inputStr.path, opts)
    }
    //is single file
    else {
        files = [inputStr.path]
    }

    let numberFilesFoundInGlob = files.length
    !silent &&
        console.log(
            `found ${numberFilesFoundInGlob} files in ${inputStr.path}.`
        )
    if (numberFilesFoundInGlob === 0) {
        !silent && console.log(`thus, exiting.`)
        process.exit(0)
    }

    let arrayOfFilePaths = []
    for await (let f of files) {
        let filePathInfo = await getFilePathInfo(f)
        arrayOfFilePaths.push(filePathInfo)
    }

    //bugfix
    arrayOfFilePaths = arrayOfFilePaths.filter((f) => f !== null)

    let lengthBefore = arrayOfFilePaths.length
    arrayOfFilePaths = await ignore(arrayOfFilePaths)

    if (arrayOfFilePaths.length === 0) {
        !silent && console.log(`no files to rename, as all were ignored.`)
        process.exit(0)
    }
    !silent &&
        console.log(`ignored ${lengthBefore - arrayOfFilePaths.length} files.`)
    !silent &&
        console.log(
            chalk.blue(
                `${arrayOfFilePaths.length}/${files.length} ${
                    opts.dryrun ? `would` : `will`
                } be renamed.`
            )
        )

    if (opts.dryrun) {
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
        for await (let file of arrayOfFilePaths) {
            await processOneFile(file, opts.rename)
        }
        await logChanges(arrayOfFilePaths)
    }
}
export default run
