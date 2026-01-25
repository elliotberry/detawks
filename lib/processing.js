import { logIgnored, showProgress } from './logging-functions.js'
// Process files in batches to control concurrency
const processBatch = async (files, batchSize, processor) => {
    const results = []
    for (let index = 0; index < files.length; index += batchSize) {
        const batch = files.slice(index, index + batchSize)
        const batchResults = await Promise.all(batch.map(processor))
        results.push(...batchResults)

        // Show progress
       // showProgress(Math.min(index + batchSize, files.length), files.length)
    }
    return results
}

const processSynchronously = async (files, processor) => {
    const results = []
    for await (const file of files) {
        const result = await processor(file)
        results.push(result)
    }
    return results
}

export { processBatch, processSynchronously }
