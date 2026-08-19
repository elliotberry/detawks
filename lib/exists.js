import fs from 'node:fs/promises'

const exists = async (filePath) => {
    try {
        await fs.access(filePath)
        return true
    } catch {
        return false
    }
}

export default exists
