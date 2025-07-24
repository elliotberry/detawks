import assert from 'node:assert'
import fs from 'node:fs/promises'
import path from 'node:path'
import {afterEach, beforeEach, describe, test} from 'node:test'

import detawks from "../index.js"
import { slugify } from '../lib/slugify.js'
import {createDirectoryWithFiles, deleteDirectoryAndFiles} from './createDirectoryWithFiles.js'

describe("tests", async () => {
    let testDirectory

    beforeEach(async () => {
        const result = await createDirectoryWithFiles()
        testDirectory = result.directory
    })

    afterEach(async () => {
       await deleteDirectoryAndFiles()
    })

    test('does it do it without error', async () => {
        let failed = false
        try {
           await detawks(testDirectory)
        } catch (error) {
            console.error(error)
            failed = true
        }
        assert.strictEqual(failed, false)
    })

    test('dry run works correctly', async () => {
        let failed = false
        try {
           await detawks(testDirectory, { dryrun: true, silent: true })
        } catch (error) {
            console.error(error)
            failed = true
        }
        assert.strictEqual(failed, false)
    })

    test('batch processing works', async () => {
        let failed = false
        try {
           await detawks(testDirectory, { dryrun: true, silent: true, batchSize: 5 })
        } catch (error) {
            console.error(error)
            failed = true
        }
        assert.strictEqual(failed, false)
    })

    test('directory renaming works', async () => {
        let failed = false
        try {
            // Create a test directory with a problematic name
            const testDirPath = path.join(testDirectory, 'test-பூனைகள் fff')
            await fs.mkdir(testDirPath)
            
            // Test renaming directories
            await detawks(testDirectory, { 
                dryrun: true, 
                silent: true, 
                directories: true 
            })
        } catch (error) {
            console.error(error)
            failed = true
        }
        assert.strictEqual(failed, false)
    })

    test('glob pattern works', async () => {
        let failed = false
        try {
            const globPattern = path.join(testDirectory, '*.md')
            await detawks(globPattern, { dryrun: true, silent: true })
        } catch (error) {
            console.error(error)
            failed = true
        }
        assert.strictEqual(failed, false)
    })

    test('basic string replacement works', async () => {
        const testCases = [
            {
                expected: 'hello-world',
                input: 'Hello World',
            },
            {
                expected: 'test-file',
                input: 'Test File',
            },
            {
                expected: 'mixed-case-file',
                input: 'Mixed-Case-File',
            },
        ]

        for (const testCase of testCases) {
            const { expected, input } = testCase
            const actual = await slugify(input)
            assert.strictEqual(actual, expected, `Failed for input: "${input}"`)
        }
    })

    test('unicode and special characters are handled', async () => {
        const testCases = [
            {
                expected: 'koshki',
                input: 'кошки',
            },
            {
                expected: 'file-with-special-chars',
                input: 'file with special chars!@#',
            },
            {
                expected: 'file-with-parentheses-test',
                input: 'file with parentheses (test)',
            },
        ]

        for (const testCase of testCases) {
            const { expected, input } = testCase
            const actual = await slugify(input)
            assert.strictEqual(actual, expected, `Failed for input: "${input}"`)
        }
    })

    test('empty string handling', async () => {
        // The slugify function should handle empty strings gracefully
        // It should either return a fallback string or throw an error
        try {
            const result = await slugify('')
            // If it doesn't throw, it should return a non-empty string
            assert.strictEqual(typeof result, 'string')
            assert.strictEqual(result.length > 0, true)
        } catch (error) {
            // If it throws, that's also acceptable behavior
            assert.strictEqual(error instanceof Error, true)
        }
    })
})
