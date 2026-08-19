import chalk from 'chalk'

const logOldAndNewFilenames = (filePath, { silent } = {}) => {
    if (silent) {
        return
    }
    console.log(
        `${chalk.yellow(filePath.oldParsed.base)} -> ${chalk.green(filePath.newParsed.base)}`
    )
}

const logEmptyResult = ({ silent } = {}) => {
    if (!silent) {
        console.log('no files to rename.')
    }
}

const logSkippedCollision = (file, { silent } = {}) => {
    if (!silent) {
        console.warn(`file already exists, skipping: ${file.new}`)
    }
}

const logRenameFailure = (file, error, { silent } = {}) => {
    if (!silent) {
        console.warn(`failed to rename ${file.old}: ${error.message}`)
    }
}

const logIgnored = (keptCount, lengthBefore, { silent } = {}) => {
    if (silent || lengthBefore === keptCount) {
        return
    }
    console.log(`ignored ${lengthBefore - keptCount} files.`)
}

const logSummary = (
    { failed, renamed, skipped },
    { dryrun, silent } = {}
) => {
    if (silent) {
        return
    }
    if (failed === 0 && skipped === 0) {
        return
    }
    const verb = dryrun ? 'would rename' : 'renamed'
    console.log(`${verb} ${renamed}, skipped ${skipped}, failed ${failed}`)
}

const showProgress = (current, total, { silent } = {}) => {
    if (silent || total <= 10) {
        return
    }
    const percentage = Math.round((current / total) * 100)
    process.stdout.write(`\rProcessing: ${current}/${total} (${percentage}%)`)
    if (current === total) {
        process.stdout.write('\n')
    }
}

export {
    logEmptyResult,
    logIgnored,
    logOldAndNewFilenames,
    logRenameFailure,
    logSkippedCollision,
    logSummary,
    showProgress,
}
