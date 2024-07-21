import fs from 'node:fs/promises'
import path from 'node:path'

const readDirectory = async (directory, includeDirectories = false) => {

    const files = await fs.readdir(directory, { withFileTypes: true })

    return files
        .map((f) => {
            if (!includeDirectories && !f.isFile()) {
                return null;
            }
            return path.join(directory, f.name);
        })
        .filter(f => f !== null);
}

export default readDirectory
