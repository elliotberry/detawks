import path from 'path';
import fs from 'fs';
import { replaceSquiglyWithHome, isStringAGlobPattern } from '../index.js';

//verify input
export const getPathIfPath = async (globPath) => {
    let ret = null;
    globPath = replaceSquiglyWithHome(globPath);
    try {
        let stats = await fs.promises.stat(globPath);
        if (stats.isDirectory() || stats.isFile()) {
            ret = {
                path: path.resolve(globPath),
                parent: path.dirname(globPath),
                parentPath: path.resolve(path.dirname(globPath)),
                type: stats.isDirectory() ? 'directory' : 'file',
            };
        }
    } catch (e) {
        ret = null;
    }

    if (ret === null) {
        if (isStringAGlobPattern(globPath)) {
            ret = { path: globPath, type: 'glob' };
        }
    }

    return ret;
};
