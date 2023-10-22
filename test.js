import fs from 'fs'
import path from 'path'
import detawks from './index.js'
import chalk from 'chalk'
import { slugify } from './lib/slugify.js'
import { exec } from 'child_process'

import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
//this part is important for the tests to run
var coolText = chalk.bgBlue.black

const dirPath = path.resolve(path.join(__dirname, 'test-assets'))
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

const testSlugify = async () => {
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
    for await (let testCase of testCases) {
        const { input, expected } = testCase
        const actual = slugify(input)
        if (actual !== expected) {
            console.log(`expected ${expected} but got ${actual}`)
        } else {
            console.log(`passed test: ${input} -> ${actual}`)
        }
    }
}

async function deleteDirectoryAndFiles() {
    try {
        await fs.promises.rm(dirPath, { recursive: true })

        console.log(coolText('deleted test dir'))
    } catch (e) {
        console.log(coolText('no folder to delete'))
    }
}

async function createDirectoryWithFiles() {
    await deleteDirectoryAndFiles()
    // Create directory
    await fs.promises.mkdir(dirPath)

    const getRandomNames = (num = 1) => {
        let nameArr = []
        for (let i = 0; i < num; i++) {
            nameArr.push(names[Math.floor(Math.random() * names.length)])
        }
        return nameArr.join(' ')
    }
    let arr = Array.from({ length: 20 }, (_, i) => i)
    let testFilesMade = 0
    let oneFilePath = ''
    for await (let i of arr) {
        const num = Math.floor(Math.random() * 5) + 1
        let ext = '.txt'
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

const withAPI = async () => {
    console.log(coolText('Running tests...'))
    // Execute the functions
    console.log(coolText('Creating directory with files...'))
    let oneFilePath = await createDirectoryWithFiles()
    console.log(
        coolText(`Running detawks against one file... (${oneFilePath}))`)
    )
    await detawks(oneFilePath)
    let testGlob = `${dirPath}/*.md`
    console.log(coolText(`Running detawks with a glob... (${testGlob})`))
    await detawks(testGlob)
    console.log(coolText('Running detawks against the whole test directory...'))
    await detawks(dirPath)
    console.log(coolText('Deleting directory and files...'))

    console.log(coolText('Tests finished!'))
}

const withCommandLine = async () => {
    console.log(coolText('Running tests with command line...'))
    console.log(coolText('Creating directory with files...'))
    let oneFilePath = await createDirectoryWithFiles()
    let opts = { dryrun: false, rename: true, silent: true }
    console.log(coolText('Options for the tests:'))
    console.log(coolText(opts.toString()))
    console.log(
        coolText(`Running detawks against one file... (${oneFilePath}))`)
    )
    exec(
        `detawks ${oneFilePath} --dryrun --rename --silent`,
        (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`)
                return
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
                return
            }
            console.log(stdout)
        }
    )
    let testGlob = `${dirPath}/*.md`
    console.log(coolText(`Running detawks with a glob... (${testGlob})`))
    exec(
        `detawks ${testGlob} --dryrun --rename --silent`,
        (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`)
                return
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
                return
            }
            console.log(stdout)
        }
    )
    console.log(coolText('Running detawks against the whole test directory...'))
    exec(
        `detawks ${dirPath} --dryrun --rename --silent`,
        (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`)
                return
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
                return
            }
            console.log(stdout)
        }
    )
    console.log(coolText('Deleting directory and files...'))

    console.log(coolText('Tests finished!'))
}

const main = async () => {
    await testSlugify()
    await withAPI()
    await withCommandLine()
}
main()
