import fs from 'fs';
import path from 'path';
import __dirname from '../lib/__dirname.js'

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
    await deleteDirectoryAndFiles();
    // Create directory
    await fs.promises.mkdir(dirPath);

    const getRandomNames = (num = 1) => {
        let nameArr = [];
        for (let i = 0; i < num; i++) {
            nameArr.push(names[Math.floor(Math.random() * names.length)]);
        }
        return nameArr.join(' ');
    };
    let arr = Array.from({ length: 20 }, (_, i) => i);
    let testFilesMade = 0;
    let oneFilePath = '';
    for await (let i of arr) {
        const num = Math.floor(Math.random() * 5) + 1;
        let ext = '.txt';
        if (i === 0) {
            ext = '.md';
        }

        let filePath = path.join(dirPath, `${getRandomNames(num)}${ext}`);
        await fs.promises.writeFile(filePath, 'Test content');
        testFilesMade++;
        if (i === 19) {
            oneFilePath = filePath;
        }
    }
    console.log(`created ${testFilesMade} test files`)
    return oneFilePath;
}

export default createDirectoryWithFiles