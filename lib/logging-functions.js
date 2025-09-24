const logIgnored = (arrayOfFilePaths, lengthBefore, options, files) => {
    if (arrayOfFilePaths.length === 0) {
        !globalThis.silent &&
            console.log(`no files to rename, as all were ignored.`)
        throw new Error('no files to rename.')
    }
    !globalThis.silent &&
        console.log(`ignored ${lengthBefore - arrayOfFilePaths.length} files.`)
    !globalThis.silent &&
        console.log(
            `${arrayOfFilePaths.length}/${files.length} ${
                options.dryrun ? `would` : `will`
            } be renamed.`
        )
}

const filesFoundInfo = (files, inputString, type) => {
    const numberFilesFoundInGlob = files.length
    if (numberFilesFoundInGlob === 1) {
        !globalThis.silent && console.log(`found a file: ${files[0]}.`)
    } else {
        !globalThis.silent &&
            console.log(
                `found ${numberFilesFoundInGlob} files with input type ${type}.`
            )
        if (numberFilesFoundInGlob === 0) {
            !globalThis.silent && console.log(`thus, exiting.`)
            throw new Error('no files found.')
        }
    }
}

const showProgress = (current, total) => {
    if (!globalThis.silent && total > 10) {
        const percentage = Math.round((current / total) * 100)
        process.stdout.write(`\rProcessing: ${current}/${total} (${percentage}%)`)
        if (current === total) {
            process.stdout.write('\n')
        }
    }
}

export { filesFoundInfo, logIgnored, showProgress }