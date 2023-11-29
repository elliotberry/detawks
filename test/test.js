import fs from 'fs'
import path from 'path'
import detawks from '../index.js'
import chalk from 'chalk'
import { slugify } from '../lib/slugify.js'
import { exec } from 'node:child_process'
import assert from 'assert'
import { fileURLToPath } from 'url'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import test from 'node:test'
import __dirname from '../lib/__dirname.js'

const execa = async cmd => new Promise((resolve, reject) => {
exec(cmd, (error, stdout, stderr) => {
    if (error || stderr) {
        throw new Error(error || stderr)
    }
    resolve(stdout)
})
})
const coolText = chalk.bgBlue.black; //this part is important for the tests to run
const app = 'node ./cli.js';
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

const containsThingsIDontWant = (p)  => {
    let base = path.basename(p)
    
}

async function deleteDirectoryAndFiles() {
    try {
        await fs.promises.rm(dirPath, { recursive: true })

        console.log(coolText('deleted test dir'))
    } catch (e) {
        //  console.log(coolText('no folder to delete'))
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

test('test command line usage', async (t) => {
    let failed = false;
    try {
        let oneFilePath = await createDirectoryWithFiles()
        await execa(`${app} "${oneFilePath}" --dryrun --rename --silent`)
    } catch (e) {
        console.error(e)
        failed = true
    }
    assert.strictEqual(failed, false)
})
test('test command line usage for extreme error', async (t) => {
    let failed = false;
    try {
        console.log(coolText('Running tests with command line...'))
        console.log(coolText('Creating directory with files...'))
        let oneFilePath = await createDirectoryWithFiles()
        let opts = { dryrun: false, rename: true, silent: true }
        console.log(coolText('Options for the tests:'))
        console.log(coolText(opts.toString()))
        console.log(
            coolText(`Running detawks against one file... (${oneFilePath}))`)
        )
        let testGlob = `${dirPath}/*.md`
        console.log(coolText(`Running detawks with a glob... (${testGlob})`))
        exec(
            `${app} ${testGlob} --dryrun --rename --silent`,
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
        console.log(
            coolText('Running detawks against the whole test directory...')
        )
        exec(
            `${app} ${dirPath} --dryrun --rename --silent`,
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
    } catch (e) {
        console.error(e)
        failed = true
    }
    assert.strictEqual(failed, false)
})

test('test basic string replacement', async (t) => {
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
        assert.strictEqual(expected, actual)
    }
})
