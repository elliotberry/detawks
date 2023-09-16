import fs from 'fs'
import path from 'path'
import detawks from './index.js'
import chalk from 'chalk'
import slugify from './lib/slugify.js'
var coolText = chalk.bgBlue.black;
const testSlugify = () => {
    const testCases = [
        {
            input: 'Hello World',
            expected: 'hello-world',
        },
        {
            input: 'Hello World',
            expected: 'hello-world',
        },
        {
            input: 'Hello World',
            expected: 'hello-world',
        },
    ]
    testCases.forEach((testCase) => {
        const { input, expected } = testCase
        const actual = slugify(input)
        if (actual !== expected) {
            console.log(`expected ${expected} but got ${actual}`)
        }
    })
}

const dirPath = './test-assets'
const names = [
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

async function deleteDirectoryAndFiles() {
    // Delete files in the directory
    await fs.readdirSync(dirPath).forEach((file) => {
        fs.unlinkSync(path.join(dirPath, file))
    })

    // Delete the directory
    await fs.rmdirSync(dirPath)
    console.log(coolText("deleted test dir"))
}
async function createDirectoryWithFiles() {
    // Create directory
    try {
        await fs.promises.mkdir(dirPath)
    } catch (err) {
        if (err.code === 'EEXIST') {
            console.log(chalk.yellow('Directory already exists.'))
            await deleteDirectoryAndFiles()
            await createDirectoryWithFiles()
        } else {
            console.log(chalk.red(err))
        }
    }
    const getRandomNames = (num = 1) => {
        let nameArr = []
        for (let i = 0; i < num; i++) {
            nameArr.push(names[Math.floor(Math.random() * names.length)])
        }
        return nameArr.join(' ')
    }
    let arr = Array.from({ length: 20 }, (_, i) => i);
    let testFilesMade = 0
    let oneFilePath = "";
    for await (let i of arr) {

        const num = Math.floor(Math.random() * 5) + 1
        let ext = ".txt"
        if (i === 0) {
            ext = '.md'
        }

        let filePath = path.join(dirPath, `${getRandomNames(num)}${ext}`)
        await fs.promises.writeFile(filePath, 'Test content')
        testFilesMade++
        if (i === 19) {
            oneFilePath = filePath
        }
    }
    console.log(coolText(`created ${testFilesMade} test files`))
    return oneFilePath
}

const main = async () => {
    console.log(coolText('Running tests...'))
    // Execute the functions
    console.log(coolText('Creating directory with files...'))
    let oneFilePath = await createDirectoryWithFiles()
    let opts = { dryrun: false, rename: true, silent: true }
    console.log(coolText('Options for the tests:'))
    Object.keys(opts).forEach((key) => {
        console.log(coolText(`${key}: ${opts[key]}`))
    })
    console.log(coolText('Running detawks against one file...'))
    await detawks(oneFilePath, opts)
    console.log(coolText('Running detawks with a glob...'))
    await detawks('./test-assets/*.txt', opts)
    console.log(coolText('Running detawks against the whole test directory...'))
    
    await detawks(dirPath, opts)
    console.log(coolText('Deleting directory and files...'))
    await deleteDirectoryAndFiles()
    console.log(coolText('Tests finished!'))
}
main()
