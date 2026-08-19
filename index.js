import path from 'node:path'

import collectFiles from './lib/collect-files.js'
import getFilePathInfo from './lib/file-path-info.js'
import ignore from './lib/ignore.js'
import {
    logEmptyResult,
    logIgnored,
    logOldAndNewFilenames,
    logRenameFailure,
    logSummary,
    showProgress,
} from './lib/logging-functions.js'
import { validateAndFormatInput } from './lib/path-validation.js'
import processOneFile from './lib/process-one-file.js'
import { processBatch, processSynchronously } from './lib/processing.js'
import config from './lib/rc.js'
import assignUniqueDestinations from './lib/unique-destinations.js'

const byDeepestPath = (fileA, fileB) =>
    fileB.old.split(path.sep).length - fileA.old.split(path.sep).length

const run = async (globPattern, userOptions) => {
    const options = userOptions
        ? Object.assign({}, config, userOptions)
        : { ...config }

    options.dryrun = Boolean(
        options.dryrun || options.dryRun || options['dry-run']
    )
    options.silent = Boolean(options.silent)
    options.rename = options.rename !== false
    options.batchSize = Number(options.batchSize) > 0 ? options.batchSize : 50

    const silent = options.silent
    const input = await validateAndFormatInput(globPattern)
    const files = await collectFiles(input, options)

    const onProgress = (current, total) =>
        showProgress(current, total, { silent })

    let arrayOfFilePaths = await processBatch(
        files,
        options.batchSize,
        (filePath) => getFilePathInfo(filePath, { silent }),
        { onProgress }
    )

    arrayOfFilePaths = arrayOfFilePaths.filter(
        (file) => file && file.old && file.new && file.old !== file.new
    )

    const lengthBefore = arrayOfFilePaths.length
    arrayOfFilePaths = ignore(arrayOfFilePaths, options.ignores)
    logIgnored(arrayOfFilePaths.length, lengthBefore, { silent })

    if (arrayOfFilePaths.length === 0) {
        logEmptyResult({ silent })
        return { failed: 0, files: [], renamed: 0, skipped: 0 }
    }

    const unique = await assignUniqueDestinations(arrayOfFilePaths, {
        rename: options.rename,
        silent,
    })
    arrayOfFilePaths = unique.files

    if (options.directories) {
        arrayOfFilePaths.sort(byDeepestPath)
    }

    const results = []
    if (options.dryrun) {
        for (const file of arrayOfFilePaths) {
            results.push({ file, status: 'renamed' })
        }
    } else {
        const processor = async (file) => {
            try {
                await processOneFile(file, { silent })
                return { file, status: 'renamed' }
            } catch (error) {
                logRenameFailure(file, error, { silent })
                return { error, file, status: 'failed' }
            }
        }

        const process =
            options.directories ? processSynchronously : processBatch
        const processed = await process(
            arrayOfFilePaths,
            options.batchSize,
            processor,
            { onProgress }
        )
        results.push(...processed)
    }

    for (const file of arrayOfFilePaths) {
        logOldAndNewFilenames(file, { silent })
    }

    const renamed = results.filter((result) => result.status === 'renamed').length
    const failed = results.filter((result) => result.status === 'failed')
    const skipped = unique.skipped.length

    logSummary(
        { failed: failed.length, renamed, skipped },
        { dryrun: options.dryrun, silent }
    )

    if (failed.length > 0) {
        const error = new Error(
            `failed to rename ${failed.length} of ${results.length} file(s)`
        )
        error.failed = failed
        throw error
    }

    return {
        failed: 0,
        files: arrayOfFilePaths,
        renamed,
        skipped,
    }
}

export default run
