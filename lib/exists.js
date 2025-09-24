import fs from 'fs/promises';
const exists = async (path) => {
    try {
        await fs.access(path);
        return true;
    }
    catch (e) {
        return false;
    }
}

export default exists;