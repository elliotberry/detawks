import path from 'path'
import fs from 'fs'
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
// First find out the __dirname, then resolve to one higher level in the dir tree
const __dirname = path.resolve(path.dirname(__filename), "../");


let simpleIgnore = ['node_modules', '.git', '.DS_Store']
var ignores;

// Takes an array of file paths as input. // Reads the .ignore file in the directory and filters out files and directories that match the patterns in the .ignore file. // Returns a new array of file paths that do not match the patterns in the .ignore file.

const getIgnoreConfig = async (dir) => {
    let ret = simpleIgnore
    let ignorePath = path.join(dir, '.ignore')

    try {
        let ignoreFile = await fs.promises.readFile(ignorePath, 'utf8')
        ret = ignoreFile.split('\n')
    } catch (e) {
        console.log(`no .ignore file found in ${dir}, using defaults`)
    }
    console.log(ret)
    return ret
}

const filterFn = (f) => {
    return new Promise((resolve, reject) => {
        let parsed = path.parse(f.old)
        let dir = parsed.dir.split(path.sep)
        let ignore = false
      
        if (ignores.includes(parsed.base)) {
            ignore = true
        }
        for (let i; i <= ignores; i++) {
           
            if (dir.includes(ignores[i])) {
                ignore = true
                break
            }
        }
      
        resolve(!ignore)
    })
}
async function filterArrayAsync(arr) {
    // Use Array.filter with an async function

   let ret = await Promise.all(
        arr.map(async (e) => {
            const isEvenNumber = await filterFn(e)
            if (isEvenNumber === true) {
                return e
            }
            else {
                console.log(`ignoring ${e.old}`)
                return null
            }

        })
    )
    ret = ret.filter((e) => e !== null)
   

    return ret
}


const ignore = async (arrayOfFilePaths) => {

    ignores = await getIgnoreConfig(__dirname)
    let newArrayOfFilePaths = await filterArrayAsync(arrayOfFilePaths, filterFn)
    return newArrayOfFilePaths
}
export default ignore
