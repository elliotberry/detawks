import { promises as fs } from 'fs';
import path from 'path';

async function findClosestParentDir(path1, path2) {
  // Normalize the paths to eliminate any redundant navigation
  const absolutePath1 = path.resolve(path1);
  const absolutePath2 = path.resolve(path2);

  // Split paths into components
  const parts1 = absolutePath1.split(path.sep);
  const parts2 = absolutePath2.split(path.sep);

  // Find common path parts
  const length = Math.min(parts1.length, parts2.length);
  let i = 0;
  while (i < length && parts1[i] === parts2[i]) {
    i++;
  }

  // If there is no common path, return null
  if (i === 0) {
    return null;
  }

  // Construct the common directory path
  const commonPath = parts1.slice(0, i).join(path.sep);
  const commonDirName = parts1[i - 1];

  // Check if the common directory exists
  try {
    await fs.access(commonPath);
  } catch (error) {
    throw new Error(`The common directory does not exist: ${commonPath}`);
  }

  // Calculate relative paths
  const relativePath1 = path.relative(commonPath, absolutePath1);
  const relativePath2 = path.relative(commonPath, absolutePath2);

  // Return the result as an object
  const obj = {
    name: commonDirName,
    path: commonPath,
    relativePaths: {
      a: relativePath1,
      b: relativePath2,
    },
  };
  return `.../${obj.name}/${obj.relativePaths.a} -> .../${obj.name}/${obj.relativePaths.b}`;
}
const baseLog = async (fpath) => {
}

export {findClosestParentDir, baseLog};