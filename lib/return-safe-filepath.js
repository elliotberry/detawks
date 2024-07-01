import exists from "./exists.js"
import fs from "node:fs/promises"
import path from "node:path"

const isDirectoryWithCatch = async (destination) => {
  let isDir = false
  try {
    let ii = await fs.stat(destination)
    isDir = ii.isDirectory()
  } catch (error) {
    if (error.code === "ENOENT") {
      isDir = false
    } else {
      throw error
    }
  }
  return isDir
}


function getBasenameAndSuffix(str) {
  let theName
  let theSuffix = ""
  let theDashed = str.split("-")
  if (theDashed.length === 1) {
    theName = str
    return { name: theName, suffix: theSuffix }
  } else {
    let possibleSuffix = theDashed[theDashed.length - 1]
    let possibleSuffixNumber = parseInt(possibleSuffix)
    if (isNaN(possibleSuffixNumber)) {
      theName = str
      return { name: theName, suffix: theSuffix }
    } else {
      theName = theDashed.slice(0, -1).join("-")
      theSuffix = possibleSuffix
      return { basename: theName, suffix: theSuffix }
    }
  }
}

const splitFileIntoThePartsINeed = (file, directory) => {
  let [originalBasename, extension] = file.split(".")
  let { basename, suffix } = getBasenameAndSuffix(originalBasename)
  return { basename, suffix, extension, directory }
}

const returnSafeFilePath = async (destination) => {
  if (await isDirectoryWithCatch(destination)) {
    throw new Error("destination is a directory")
  }
  destination = path.resolve(destination)
  let file = path.basename(destination)
  let directory = path.dirname(destination)
  if ((await exists(destination)) === false) {
    return destination
  }

  let { basename, suffix, extension } = splitFileIntoThePartsINeed(
    file,
    directory
  )

  let count = suffix
  while ((await exists(destination)) === true) {
    let currentSuffix = `-${count}`
    file = `${basename}${currentSuffix}.${extension}`
    destination = path.join(directory, file)
    count++
  }
  return destination
}

export default returnSafeFilePath
