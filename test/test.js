import assert from 'assert'
import execa from 'elliotisms/exec'
import fs from 'node:fs'
import path from 'node:path'
import {describe, test, beforeEach, afterEach} from 'node:test'
import chalk from 'chalk'
import __dirname from '../lib/__dirname.js'
import { slugify } from '../lib/slugify.js'
import {createDirectoryWithFiles, deleteDirectoryAndFiles} from './createDirectoryWithFiles.js'

const coolText = chalk.bgBlue.black
const dirPath = path.resolve(path.join(__dirname, 'test-assets'))
const app = 'node ./cli.js'

 //a function that returns true if the string contains no non-ascii characters and npo underscores
 function noNonASCIIChars(string_) {
    for (let index = 0; index < string_.length; index++) {
        const charCode = string_.charCodeAt(index)
        if (charCode > 127 || charCode === 95) {
            return false
        }
    }
    return true
}

describe("tests", async () => {
    beforeEach(async (t) => {
        let files = await createDirectoryWithFiles()
        console.log(files)
        t.context.files = files
    })

    afterEach(async (t) => {
       await deleteDirectoryAndFiles()
    })
   

    test('test command line usage', async (t) => {
        let failed = false
        try {
          
            await execa(`${app} "${t.context.files[0]}" --dryrun --rename --silent`)
        } catch (error) {
            console.error(error)
            failed = true
        }
        assert.strictEqual(failed, false)
    })

    test('create a folder and test renaming it', async (t) => {
        let failed = false
        try {
          
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
        } catch (error) {
            console.error(error)
            failed = true
        }
        assert.strictEqual(failed, false)
    })

    test('test command line usage for extreme error', async (t) => {
        let failed = false
        try {
            console.log(coolText('Running tests with command line...'))
            console.log(coolText('Creating directory with files...'))
            let oneFilePath = await createDirectoryWithFiles()
            let options = { dryrun: false, rename: true, silent: true }
            console.log(coolText('Options for the tests:'))
            console.log(coolText(options.toString()))
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
        } catch (error) {
            console.error(error)
            failed = true
        }
        assert.strictEqual(failed, false)
    })

    test('test basic string replacement', async (t) => {
        const testCases = [
            {
                expected: 'hello-world',
                input: 'Hello World',
            },
            {
                expected: 'hello-world',
                input: 'Hello World',
            },
            {
                expected: 'hello-world',
                input: 'Hello World',
            },
        ]

        for await (let testCase of testCases) {
            const { expected, input } = testCase
            const actual = await slugify(input)
            assert.strictEqual(expected, actual)
        }
    })
})
const manualTest = async () => {
    await createDirectoryWithFiles()
    await execa(
        `${app} "/Users/eberry/projects/___MY-SCRIPTS/detawks/test-assets" --dryrun`
    )
}

//main()
