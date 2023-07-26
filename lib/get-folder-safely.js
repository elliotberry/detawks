import path from 'path';

// Takes a folder path as input.
// Resolves the folder path and returns the absolute path.
// If an error occurs, logs the error and exits the process with a non-zero exit code.
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