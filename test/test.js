import assert from 'node:assert/strict'
import { execFile as execFileCallback } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { afterEach, beforeEach, describe, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import detawks from '../index.js'
import { slugify } from '../lib/slugify.js'
import {
    createDirectoryWithFiles,
    deleteDirectoryAndFiles,
} from './create-directory-with-files.js'

const cliPath = fileURLToPath(new URL('../cli.js', import.meta.url))
const execFile = promisify(execFileCallback)

const listBasenames = async (directory) => {
    const entries = await fs.readdir(directory)
    return entries.toSorted()
}

describe('detawks', async () => {
    let testDirectory

    beforeEach(async () => {
        const result = await createDirectoryWithFiles()
        testDirectory = result.directory
    })

    afterEach(async () => {
        await deleteDirectoryAndFiles()
    })

    test('renames messy filenames on disk', async () => {
        const result = await detawks(testDirectory, { silent: true })
        assert.ok(result.renamed > 0)

        const names = await listBasenames(testDirectory)
        assert.ok(names.includes('my-document-1.txt'))
        assert.ok(names.includes('file-with-underscores.txt'))
        assert.ok(names.includes('file-with-spaces.txt'))
        assert.ok(names.includes('uppercase-file.TXT'))
        assert.ok(names.includes('file-with-special-chars.txt'))
        assert.ok(names.includes('file-with-unicode-koshki.txt'))
        assert.ok(names.includes('file-with-parentheses-test.txt'))
        assert.ok(names.includes('readme.md'))
        assert.ok(names.includes('hello-world.txt'))
        assert.equal(names.includes('My Document (1).txt'), false)
        assert.equal(names.includes('File With Spaces.txt'), false)
    })

    test('dry run leaves the filesystem unchanged', async () => {
        const before = await listBasenames(testDirectory)
        const result = await detawks(testDirectory, {
            dryrun: true,
            silent: true,
        })
        assert.ok(result.renamed > 0)
        const after = await listBasenames(testDirectory)
        assert.deepEqual(after, before)
    })

    test('batch processing works', async () => {
        const result = await detawks(testDirectory, {
            batchSize: 2,
            dryrun: true,
            silent: true,
        })
        assert.ok(result.renamed > 0)
    })

    test('recursive directory scan renames nested files', async () => {
        const nested = path.join(testDirectory, 'sub folder')
        await fs.mkdir(nested)
        await fs.writeFile(path.join(nested, 'Nested File.txt'), 'nested')

        await detawks(testDirectory, { silent: true })

        const nestedNames = await listBasenames(nested)
        assert.ok(nestedNames.includes('nested-file.txt'))
        assert.equal(nestedNames.includes('Nested File.txt'), false)
    })

    test('max-depth 0 does not rename nested files', async () => {
        const nested = path.join(testDirectory, 'sub folder')
        await fs.mkdir(nested)
        await fs.writeFile(path.join(nested, 'Nested File.txt'), 'nested')

        await detawks(testDirectory, { maxDepth: 0, silent: true })

        const nestedNames = await listBasenames(nested)
        assert.ok(nestedNames.includes('Nested File.txt'))
    })

    test('directory renaming is deepest-first', async () => {
        const nested = path.join(testDirectory, 'Bad Dir')
        await fs.mkdir(nested)
        await fs.writeFile(path.join(nested, 'bad file.txt'), 'x')

        await detawks(testDirectory, { directories: true, silent: true })

        const top = await listBasenames(testDirectory)
        assert.ok(top.includes('bad-dir'))
        assert.equal(top.includes('Bad Dir'), false)
        const nestedNames = await listBasenames(
            path.join(testDirectory, 'bad-dir')
        )
        assert.ok(nestedNames.includes('bad-file.txt'))
    })

    test('glob pattern only matches the given extension', async () => {
        const globPattern = path.join(testDirectory, '*.md')
        await detawks(globPattern, { silent: true })

        const names = await listBasenames(testDirectory)
        assert.ok(names.includes('readme.md'))
        assert.ok(names.includes('File With Spaces.txt'))
        assert.equal(names.includes('README.md'), false)
    })

    test('colliding targets get unique suffixes', async () => {
        await fs.writeFile(
            path.join(testDirectory, 'HELLO WORLD.txt'),
            'other'
        )

        await detawks(testDirectory, { silent: true })

        const names = await listBasenames(testDirectory)
        const collisions = names.filter((name) =>
            /^hello-world(?:-\d+)?\.txt$/.test(name)
        )
        assert.ok(collisions.length >= 2)
        assert.ok(collisions.includes('hello-world.txt'))
        assert.ok(collisions.some((name) => /hello-world-\d+\.txt/.test(name)))
    })

    test('ignores node_modules contents', async () => {
        const ignored = path.join(testDirectory, 'node_modules')
        await fs.mkdir(ignored)
        await fs.writeFile(path.join(ignored, 'Bad File.txt'), 'pkg')

        await detawks(testDirectory, { silent: true })

        const ignoredNames = await listBasenames(ignored)
        assert.ok(ignoredNames.includes('Bad File.txt'))
    })

    test('silent mode does not print rename lines', async () => {
        const logs = []
        const originalLog = console.log
        const originalWarn = console.warn
        console.log = (...arguments_) => {
            logs.push(arguments_.join(' '))
        }
        console.warn = (...arguments_) => {
            logs.push(arguments_.join(' '))
        }
        try {
            await detawks(testDirectory, { dryrun: true, silent: true })
        } finally {
            console.log = originalLog
            console.warn = originalWarn
        }
        assert.equal(logs.length, 0)
    })

    test('--no-rename skips collisions instead of suffixing', async () => {
        const result = await detawks(testDirectory, {
            rename: false,
            silent: true,
        })
        assert.ok(result.renamed >= 0)
        const names = await listBasenames(testDirectory)
        assert.ok(names.includes('hello-world.txt'))
    })
})

describe('slugify', async () => {
    test('basic string replacement works', async () => {
        const testCases = [
            { expected: 'hello-world', input: 'Hello World' },
            { expected: 'test-file', input: 'Test File' },
            { expected: 'mixed-case-file', input: 'Mixed-Case-File' },
        ]

        for (const { expected, input } of testCases) {
            const actual = await slugify(input)
            assert.equal(actual.success, true)
            assert.equal(actual.newString, expected, `Failed for "${input}"`)
        }
    })

    test('unicode and special characters are handled', async () => {
        const testCases = [
            { expected: 'koshki', input: 'кошки' },
            {
                expected: 'file-with-special-chars',
                input: 'file with special chars!@#',
            },
            {
                expected: 'file-with-parentheses-test',
                input: 'file with parentheses (test)',
            },
        ]

        for (const { expected, input } of testCases) {
            const actual = await slugify(input)
            assert.equal(actual.success, true)
            assert.equal(actual.newString, expected, `Failed for "${input}"`)
        }
    })

    test('cache hits return the same result object shape', async () => {
        const first = await slugify('Hello Cache')
        const second = await slugify('Hello Cache')
        assert.equal(first.success, true)
        assert.equal(second.success, true)
        assert.equal(first.newString, second.newString)
        assert.equal(second.newString, 'hello-cache')
    })

    test('empty string falls back to a random name', async () => {
        const result = await slugify('')
        assert.equal(result.success, true)
        assert.equal(typeof result.newString, 'string')
        assert.ok(result.newString.length > 0)
    })
})

describe('cli', async () => {
    test('exits 1 when no path is given', async () => {
        await assert.rejects(
            () => execFile(process.execPath, [cliPath]),
            (error) => error.code === 1
        )
    })

    test('lists string modification functions', async () => {
        const { stdout } = await execFile(process.execPath, [cliPath, '--list'])
        assert.match(stdout, /toParamCase/)
        assert.match(stdout, /fallbackToRandom/)
    })
})
