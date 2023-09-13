import fs from 'fs'
import path from 'path'
import detawks from './index.js'
import chalk from 'chalk'
import slugify from './lib/slugify.js'
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

const dirPath = path.join(process.cwd(), 'test-assets')
const names = [
    'Alice',
    'Bob',
    'Charlie',
    'David',
    'Eve',
    'Frank',
    'Grace',
    'Hannah',
    'Ivan',
    'Jack',
    'Karen',
    'Liam',
    'Mona',
    'Nina',
    'Oscar',
    'Paul',
    'Quinn',
    'Rita',
    'Steve',
    'Tina',
]
async function deleteDirectoryAndFiles() {
    // Delete files in the directory
    fs.readdirSync(dirPath).forEach((file) => {
        fs.unlinkSync(path.join(dirPath, file))
    })

    // Delete the directory
    fs.rmdirSync(dirPath)
}
async function createDirectoryWithFiles() {
    // Create directory
    try {
        fs.mkdirSync(dirPath)
    } catch (err) {
        if (err.code === 'EEXIST') {
            console.log(chalk.yellow('Directory already exists.'))
            await deleteDirectoryAndFiles()
            await createDirectoryWithFiles()
        } else {
            console.log(chalk.red(err))
        }
    }

    // Create 20 files with random names from the array
    for (let i = 0; i < 20; i++) {
        const filePath = path.join(
            dirPath,
            `${names[Math.floor(Math.random() * names.length)]}.txt`
        )
        fs.writeFileSync(filePath, 'Test content')
    }
}


const main = async () => {
    console.log(chalk.blue('Running tests...'))
    // Execute the functions
    console.log(chalk.blue('Creating directory with files...'))
    createDirectoryWithFiles()
    console.log(chalk.blue('Running detawks...'))
    let opts = { dryrun: false, rename: true, silent: true }
    console.log(chalk.blue(JSON.stringify(opts, null, 2)))
    try {
        await detawks(dirPath, opts)
    } catch (err) {
        console.log(chalk.red(err))
    }

    console.log(chalk.blue('Deleting directory and files...'))
    deleteDirectoryAndFiles()
    console.log(chalk.blue('Tests finished!'))
}
main()
