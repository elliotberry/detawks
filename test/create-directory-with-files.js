import fs from 'node:fs/promises'
import path from 'node:path'

import __dirname from './__dirname.js'

const directoryPath = path.resolve(path.join(__dirname, 'test-assets'))

const deleteDirectoryAndFiles = async () => {
    await fs.rm(directoryPath, { force: true, recursive: true })
}

export const testFileNames = [
    'My Document (1).txt',
    'file_with_underscores.txt',
    'File With Spaces.txt',
    'UPPERCASE_FILE.TXT',
    'file with special chars!@#.txt',
    'file with unicode кошки.txt',
    'file with parentheses (test).txt',
    'README.md',
    'hello-world.txt',
]

const createDirectoryWithFiles = async () => {
    await deleteDirectoryAndFiles()
    await fs.mkdir(directoryPath)

    const files = []
    for (const fileName of testFileNames) {
        const filePath = path.join(directoryPath, fileName)
        await fs.writeFile(filePath, `Test content for ${fileName}`)
        files.push(filePath)
    }

    return { directory: directoryPath, files }
}

export { createDirectoryWithFiles, deleteDirectoryAndFiles }
