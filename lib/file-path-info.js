import path from 'path';
import slugify from './slugify.js';

// Takes a file path and an optional boolean flag as input.
// Extracts information about the file, such as the directory, file name, and file extension.
// Creates a new file name that is a URL-friendly version of the original file name and returns an object that contains the old file path and the new file path if the new file name is different from the original file name. Otherwise, it returns null.
const getFilePathInfo = (filePath, fixExts=false) => {
  let returnValue = null;
  try {
    let currentPath = path.parse(path.resolve(filePath));

    let newName = slugify(currentPath.name);
    let newExtension = currentPath.ext;
    if (fixExts) {
      newExtension = newExtension.split('~')[0];
      newExtension = newExtension.toLowerCase();
    }
    if (currentPath.name !== newName) {
  
      returnValue = {
        old: path.join(currentPath.dir, currentPath.name + currentPath.ext),
        new: path.join(currentPath.dir, newName + newExtension),
      };
    }
  } catch (e) {
    console.log(`error processing ${filePath}: ${e}`);
  }
  return returnValue;
};
export default getFilePathInfo;