import path from 'path';
import slugify from './slugify.js';

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