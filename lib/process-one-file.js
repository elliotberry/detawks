import fs from 'node:fs/promises'
import { setTimeout } from 'node:timers/promises'

const TRANSIENT_CODES = new Set(['EAGAIN', 'EBUSY', 'EMFILE', 'ENFILE'])

const processOneFile = async (
    fileObject,
    { retries = 3, silent = false } = {}
) => {
    if (fileObject.new === fileObject.old) {
        return
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await fs.rename(fileObject.old, fileObject.new)
            return
        } catch (error) {
            const transient = TRANSIENT_CODES.has(error.code)
            if (!transient || attempt === retries) {
            throw new Error(
                `error processing file: ${fileObject.old}; ${error.message}`,
                { cause: error }
            )
            }

            const delay = Math.min(1000 * 2 ** (attempt - 1), 5000)
            await setTimeout(delay)

            if (!silent) {
                console.warn(
                    `retry ${attempt}/${retries} for ${fileObject.old}: ${error.message}`
                )
            }
        }
    }
}

export default processOneFile
