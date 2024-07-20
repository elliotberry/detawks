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
const filesFoundInfo = (files, inputString, type) => {
    const numberFilesFoundInGlob = files.length
    if (numberFilesFoundInGlob === 1) {
        !global.silent && console.log(`found a file: ${files[0]}.`)
    } else {
        !global.silent &&
            console.log(
                `found ${numberFilesFoundInGlob} files in ${type} ${inputString.path ? inputString.path : `'${inputString.input}'`}.`
            )
        if (numberFilesFoundInGlob === 0) {
            !global.silent && console.log(`thus, exiting.`)
            throw new Error('no files found.')
        }
    }
}

export { filesFoundInfo,logIgnored }