import { performance } from 'node:perf_hooks'

import { logOldAndNewFilenames } from './lib/closest-parent-info.js'
import getFilePathInfo from './lib/file-path-info.js'
import ignore from './lib/ignore.js'
import { filesFoundInfo, logIgnored, showProgress } from './lib/logging-functions.js'
import { validateAndFormatInput } from './lib/path-validation.js'
import processOneFile from './lib/process-one-file.js'
import config from './lib/rc.js'
import readDirectory from './lib/read-directory.js'
import useFdir from './lib/use-fdir.js'

// Process files in batches to control concurrency
const processBatch = async (files, batchSize, processor) => {
    const results = []
    for (let index = 0; index < files.length; index += batchSize) {
        const batch = files.slice(index, index + batchSize)
        const batchResults = await Promise.all(batch.map(processor))
        results.push(...batchResults)
        
        // Show progress
        showProgress(Math.min(index + batchSize, files.length), files.length)
    }
    return results
}

const run = async (globPattern, userOptions) => {
    const startTime = performance.now()
    const options = userOptions
        ? Object.assign({}, config, userOptions)
        : config

    globalThis.silent = options.silent

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

    //get pending new/old filepaths given our current options loadout - optimized for concurrent processing
    const batchSize = options.batchSize || 50
    let arrayOfFilePaths = await processBatch(files, batchSize, getFilePathInfo)
    //filter out null paths (bugfix)
    arrayOfFilePaths = arrayOfFilePaths.filter((f) => f !== null)

    //Tell the user we ignored some garbage files
    const lengthBefore = arrayOfFilePaths.length
    arrayOfFilePaths = await ignore(arrayOfFilePaths)
    logIgnored(arrayOfFilePaths, lengthBefore, options, files)

    // Process files in batches for better performance and control
    if (!options.dryrun) {
        await processBatch(arrayOfFilePaths, batchSize, file => processOneFile(file, options.rename))
    }
    
    // Log results sequentially to maintain readable output order
    for await (const file of arrayOfFilePaths) {
        await logOldAndNewFilenames(file)
    }

    // Show performance summary
    if (!globalThis.silent && files.length > 10) {
        const endTime = performance.now()
        const duration = ((endTime - startTime) / 1000).toFixed(2)
        const filesPerSecond = (files.length / (endTime - startTime) * 1000).toFixed(1)
        console.log(`\nPerformance: Processed ${files.length} files in ${duration}s (${filesPerSecond} files/sec)`)
    }
}
export default run
