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
export const names = [
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
async function createDirectoryWithFiles() {
    await deleteDirectoryAndFiles()
    // Create directory
    await fs.promises.mkdir(dirPath)

    const getRandomNames = (number_ = 1) => {
        let nameArray = []
        for (let index = 0; index < number_; index++) {
            nameArray.push(names[Math.floor(Math.random() * names.length)])
        }
        return nameArray.join(' ')
    }
    let array = Array.from({ length: 20 }, (_, index) => index)
    let files = []

    for await (let index of array) {
        const number_ = Math.floor(Math.random() * 5) + 1
        let extension = '.txt'
        if (index === 0) {
            extension = '.md'
        }

        let filePath = path.join(
            dirPath,
            `${getRandomNames(number_)}${extension}`
        )
        await fs.promises.writeFile(filePath, 'Test content')
        files.push(filePath)
    }

    return {files: files, directory: dirPath}
}

export { createDirectoryWithFiles, deleteDirectoryAndFiles }
