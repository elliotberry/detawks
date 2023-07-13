
import path from 'path';
const getFolderSafely = async folderPath => {
  try {
    return path.resolve(folderPath);
  }
  catch (e) {
    console.log(`error resolving ${folderPath}: ${e}`);
    process.exit(1);
  }
};
export default getFolderSafely;