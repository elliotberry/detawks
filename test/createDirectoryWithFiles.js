import fs from 'fs';
import path from 'path';
import { deleteDirectoryAndFiles, dirPath, names, coolText } from './test.js';

export async function createDirectoryWithFiles() {
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
    console.log(coolText(`created ${testFilesMade} test files`));
    return oneFilePath;
}
