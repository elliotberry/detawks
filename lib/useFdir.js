import { fdir } from 'fdir';
import { opts } from '../index.js';

export const useFdir = async (globPattern) => {
    var files = [];
    if (opts.directories) {
        !opts.silent && console.log(`including directories.`);
        if (opts.maxDepth) {
            files = await new fdir()
                .withFullPaths()
                .withMaxDepth(opts.maxDepth)
                .withDirs()
                .crawl(globPattern)
                .withPromise();
        } else {
            files = await new fdir()
                .withFullPaths()
                .withDirs()
                .crawl(globPattern)
                .withPromise();
        }
    } else {
        if (opts.maxDepth) {
            files = await new fdir()
                .withMaxDepth(opts.maxDepth)
                .withFullPaths()
                .crawl(globPattern)
                .withPromise();
        } else {
            files = await new fdir()
                .withFullPaths()
                .crawl(globPattern)
                .withPromise();
        }
    }

    return files;
};
