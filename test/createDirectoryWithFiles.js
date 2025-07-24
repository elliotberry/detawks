import fs from 'node:fs'
import path from 'node:path'

import __dirname from './__dirname.js'

//this part is important for the tests to run

const dirPath = path.resolve(path.join(__dirname, 'test-assets'))
async function deleteDirectoryAndFiles() {
    try {
        await fs.promises.rm(dirPath, { recursive: true })

        console.log('deleted test dir')
    } catch {
        //  console.log(coolText('no folder to delete'))
    }
}

// More diverse test file names that will actually test renaming functionality
export const testFileNames = [
    'My Document (1).txt',
    'file_with_underscores.txt',
    'File With Spaces.txt',
    'UPPERCASE_FILE.TXT',
    'mixed-Case-File.txt',
    'file.with.dots.txt',
    'file-with-dashes.txt',
    'file with special chars!@#.txt',
    'file with unicode кошки.txt',
    'file with emojis 🐱‍👤.txt',
    'file with numbers 123.txt',
    'file with parentheses (test).txt',
    'file with brackets [test].txt',
    'file with braces {test}.txt',
    'file with quotes "test".txt',
    'file with apostrophe\'s.txt',
    String.raw`file with backslashes\test.txt`,
    'file with forward slashes in name.txt',
    'file with multiple   spaces.txt',
    'file with tabs.txt',
    'README.md',
    'package.json',
    'config.yaml',
    'data.csv',
    'image.jpg',
    'video.mp4',
    'archive.zip',
    'script.sh',
    'style.css',
    'index.html',
    'document.pdf',
    'presentation.pptx',
    'spreadsheet.xlsx',
    'database.sql',
    'log file.log',
    'backup file.bak',
    'temp file.tmp',
    'cache file.cache',
    'config file.conf',
    'settings file.ini'
]

async function createDirectoryWithFiles() {
    await deleteDirectoryAndFiles()
    // Create directory
    await fs.promises.mkdir(dirPath)

    const files = []

    // Create files with the predefined test names
    for (const fileName of testFileNames) {
        const filePath = path.join(dirPath, fileName)
        await fs.promises.writeFile(filePath, `Test content for ${fileName}`)
        files.push(filePath)
    }

    // Also create some random files for variety
    const randomNames = [
        'Persian',
        'Siamese', 
        'Maine Coon',
        'Ragdoll',
        'Sphynx',
        'Bengal',
        'Abyssinian',
        'British Shorthair',
        'Scottish Fold',
        'Burmese',
        'Oriental',
        'Siberian',
        'Tonkinese',
        'Russian Blue',
        'Norwegian Forest',
        'кошки',
        'பூனைகள்',
        '✨🌀🌈🐱‍👤🐱‍🚀🐱‍🐉🐱‍💻👾🎃🕺💃🎉🎲🎸🚀🌠🌌🔮💎🎭🎨🖖🌀✨',
    ]

    const getRandomNames = (number_ = 1) => {
        let nameArray = []
        for (let index = 0; index < number_; index++) {
            // Safe to use Math.random for test file generation
            nameArray.push(randomNames[Math.floor(Math.random() * randomNames.length)])
        }
        return nameArray.join(' ')
    }

    // Create 10 additional random files
    for (let i = 0; i < 10; i++) {
        const number_ = Math.floor(Math.random() * 3) + 1
        let extension
        if (i % 3 === 0) {
            extension = '.md'
        } else if (i % 3 === 1) {
            extension = '.json'
        } else {
            extension = '.txt'
        }
        
        const fileName = `${getRandomNames(number_)}${extension}`
        const filePath = path.join(dirPath, fileName)
        await fs.promises.writeFile(filePath, `Random test content for ${fileName}`)
        files.push(filePath)
    }

    return {files: files, directory: dirPath}
}

export { createDirectoryWithFiles, deleteDirectoryAndFiles }
