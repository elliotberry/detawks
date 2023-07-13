import path from 'path'

let simpleIgnore = ['node_modules', '.git', '.DS_Store']



const filterFn = (f) => {
    return new Promise((resolve, reject) => {
        let parsed = path.parse(f.old)
        let dir = parsed.dir.split(path.sep)
        let ignore = false
      
        if (simpleIgnore.includes(parsed.base)) {
            ignore = true
        }
        for (let i; i <= simpleIgnore; i++) {
           
            if (dir.includes(simpleIgnore[i])) {
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
    let newArrayOfFilePaths = await filterArrayAsync(arrayOfFilePaths, filterFn)
    return newArrayOfFilePaths
}
export default ignore
