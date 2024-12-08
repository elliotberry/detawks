import chalk from 'chalk'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

//
// Logchanged filenames to disk. not currently used.
//

const logDirectory = path.join(os.homedir(), '.config')

// Ensure the log directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory)
}

function logChanges(array) {
    const currentDate = new Date()
    const logFileName = `${currentDate.toISOString().split('T')[0]}.log`
    const logFilePath = path.join(logDirectory, logFileName)

    // Write the array and the current date to the log file
    const logContent = `Date: ${currentDate.toISOString()}\nData: ${JSON.stringify(array, undefined, 2)}\n`
    fs.writeFileSync(logFilePath, logContent)

    // Check for older logs and truncate if there are more than 10
    const logFiles = fs
        .readdirSync(logDirectory)
        .filter((file) => file.endsWith('.log'))
        .sort()
    while (logFiles.length > 10) {
        const oldestLog = logFiles.shift()
        fs.unlinkSync(path.join(logDirectory, oldestLog))
    }
    !globalThis.silent &&
        console.log(chalk.green(`logged changes to ${logFilePath}`))
}

export default logChanges
