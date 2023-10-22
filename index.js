import getFilePathInfo from './lib/file-path-info.js'
import ignore from './lib/ignore.js'
import processOneFile from './lib/process-one-file.js'
import useFdir from './lib/useFdir.js'
import { validateAndFormatInput } from './lib/path-validation.js'
import logChanges from './lib/log-changes.js'
import chalk from 'chalk'
import config from './lib/rc.js'

const run = async (globPattern, userOpts) => {
    var opts
    if (userOpts) {
        opts = Object.assign({}, config, userOpts)
    } else {
        opts = config
    }
    global.silent = opts.silent

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
    !global.silent &&
        console.log(
            `found ${numberFilesFoundInGlob} files in ${inputStr.path}.`
        )
    if (numberFilesFoundInGlob === 0) {
        !global.silent && console.log(`thus, exiting.`)
        process.exit(0)
    }

    let arrayOfFilePaths = []
    for await (let file of files) {
        let filePathInfo = await getFilePathInfo(file)
        arrayOfFilePaths.push(filePathInfo)
    }

    //bugfix
    arrayOfFilePaths = arrayOfFilePaths.filter((f) => f !== null)

    let lengthBefore = arrayOfFilePaths.length
    arrayOfFilePaths = await ignore(arrayOfFilePaths)

    if (arrayOfFilePaths.length === 0) {
        !global.silent &&
            console.log(`no files to rename, as all were ignored.`)
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
        console.log(
            arrayOfFilePaths
                .map((f) => {
                    return `${f.old} -> ${f.new}`
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
