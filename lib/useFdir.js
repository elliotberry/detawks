import { fdir } from 'fdir'
var silent = global.silent

/**
 * Returns an array of file paths for a glob based on program opts.
 * args: {string} globPattern - The glob pattern to match against file paths.
 */
const useFdir = async (globPattern, maxDepth,directories, glob=false) => {
    try {
      
        let funktion = new fdir().withFullPaths();
        console.log(funktion)
        if (maxDepth) {
            funktion = funktion.withMaxDepth(maxDepth)
        }
        if (directories) {
            funktion = funktion.withDirs()
        }
       // if (glob) {
     //      return await funktion.glob("*").crawl().withPromise()
      //  }
      //  else {
            return await funktion.crawl(globPattern).withPromise();
      //  }
      

       
    } catch (e) {
        throw new Error(`error using fdir: ${e.toString()}`)
    }
}

export default useFdir
