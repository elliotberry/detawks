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
import { createDirectoryWithFiles } from './createDirectoryWithFiles.js'
export async function deleteDirectoryAndFiles() {
    try {
        await fs.promises.rm(dirPath, { recursive: true })

        console.log(coolText('deleted test dir'))
    } catch (e) {
        //  console.log(coolText('no folder to delete'))
    }
}
export const coolText = chalk.bgBlue.black //this part is important for the tests to run
export const dirPath = path.resolve(path.join(__dirname, 'test-assets'))
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

const main = async () => {
    const execa = async (cmd) =>
        new Promise((resolve, reject) => {
            exec(cmd, (error, stdout, stderr) => {
                if (error || stderr) {
                    throw new Error(error || stderr)
                }
                resolve(stdout)
            })
        })
    const app = 'node ./cli.js'

    //a function that returns true if the string contains no non-ascii characters and npo underscores
    function noNonASCIIChars(str) {
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i)
            if (charCode > 127 || charCode === 95) {
                return false
            }
        }
        return true
    }

    await test('test command line usage', async (t) => {
        let failed = false
        try {
            let oneFilePath = await createDirectoryWithFiles()
            await execa(`${app} "${oneFilePath}" --dryrun --rename --silent`)
        } catch (e) {
            console.error(e)
            failed = true
        }
        assert.strictEqual(failed, false)
    })

    await test('create a folder and test renaming it', async (t) => {
        let failed = false
        try {
            await deleteDirectoryAndFiles()
            // Create directory
            await fs.promises.mkdir(dirPath)
            let theFolderInQuestion = path.join(dirPath, 'test-பூனைகள் fff')
            let oneFilePath = await fs.promises.mkdir(theFolderInQuestion)
            await execa(
                `${app} "${theFolderInQuestion}" --dirs --rename --silent`
            )
            //get folders in the directory
            let files = await fs.promises.readdir(dirPath)
            //filter out files
            console.log(files)
        } catch (e) {
            console.error(e)
            failed = true
        }
        assert.strictEqual(failed, false)
    })

    await test('test command line usage for extreme error', async (t) => {
        let failed = false
        try {
            console.log(coolText('Running tests with command line...'))
            console.log(coolText('Creating directory with files...'))
            let oneFilePath = await createDirectoryWithFiles()
            let opts = { dryrun: false, rename: true, silent: true }
            console.log(coolText('Options for the tests:'))
            console.log(coolText(opts.toString()))
            console.log(
                coolText(
                    `Running detawks against one file... (${oneFilePath}))`
                )
            )
            let testGlob = `${dirPath}/*.md`
            console.log(
                coolText(`Running detawks with a glob... (${testGlob})`)
            )
            await execa(`${app} ${testGlob} --dryrun --rename --silent`)
            console.log(
                coolText('Running detawks against the whole test directory...')
            )
            await execa(`${app} ${dirPath} --dryrun --rename --silent`)
            console.log(coolText('Deleting directory and files...'))

            console.log(coolText('Tests finished!'))
        } catch (e) {
            console.error(e)
            failed = true
        }
        assert.strictEqual(failed, false)
    })

    await test('test basic string replacement', async (t) => {
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
            const actual = await slugify(input)
            assert.strictEqual(expected, actual)
        }
    })
}
main()
