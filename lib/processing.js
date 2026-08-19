const processBatch = async (files, batchSize, processor, { onProgress } = {}) => {
    const size = Math.max(1, Number(batchSize) || 50)
    const results = []
    for (let index = 0; index < files.length; index += size) {
        const batch = files.slice(index, index + size)
        const batchResults = await Promise.all(batch.map((item) => processor(item)))
        results.push(...batchResults)
        onProgress?.(Math.min(index + size, files.length), files.length)
    }
    return results
}

const processSynchronously = async (files, _batchSize, processor, { onProgress } = {}) => {
    const results = []
    for (const [index, file] of files.entries()) {
        results.push(await processor(file))
        onProgress?.(index + 1, files.length)
    }
    return results
}

export { processBatch, processSynchronously }
