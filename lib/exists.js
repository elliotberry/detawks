import fs from 'node:fs/promises'
const exists = async (path) => {
    try {
        await fs.access(path)
        return true
    } catch {
        return false
    }
}

export default exists
